import Matter from "matter-js";
import {
  moveAllDotsRandomly,
  addBorder,
  updateColorsBasedOnStatus,
  updateStatusBasedOnDistance,
} from "./dots";

export default class GamePane {
  constructor() {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.world.gravity = {
      x: 0,
      y: 0,
      scale: 0,
    };

    this.bots = [];
    this.externalUsers = new Map();
    this.mouseMoveCallbacks = [];
    this.infectedCallbacks = [];
    this.updateCallbacks = [];
    this.masks = [];
    this.currentlyWearingMasks = [];
    this.thisUserChanceOfInfection = 100;

    this.width = 700;
    this.height = 700;
    this.botInitLocationX = 350;
    this.botInitLocationY = 350;
    this.botRadius = window.innerWidth < 700 ? 5 : 10;
    this.transmissionDistance = 900;
    this.botColorHealthy = "#42f595";
    this.botColorInfected = "#f54e42";
    this.userColor = "grey";
    this.externalUsersColors = ["#fcba03", "#0377fc", "#fc03f0"];

    this.stop = false;

    this.particleStatus = {
      INFECTED: "infected",
      UNINFECTED: "uninfected",
    };
  }

  createExternalUser(username) {
    let newUserDot = Matter.Bodies.circle(
      50,
      50,
      window.innerWidth < 700 ? 10 : 20,
      {
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        force: { x: 0, y: 0 },
        render: {
          strokeStyle: this.externalUsersColors[this.externalUsers.size],
          fillStyle: "transparent",
          lineWidth: 3,
        },
        label: username,
      }
    );
    this.externalUsers.set(username, newUserDot);
    // console.log(`Added external user ${username}`);
    Matter.World.add(this.world, [newUserDot]);
    return this;
  }

  addMask(limit) {
    if (this.masks.length >= (limit || 5)) return;
    let position = this.getRandomPosition();

    let mask = Matter.Bodies.circle(position.x, position.y, 20, {
      render: {
        sprite: {
          texture: "https://image.flaticon.com/icons/svg/2927/2927715.svg",
          xScale: window.innerWidth < 700 ? 0.08 : 0.1,
          yScale: window.innerWidth < 700 ? 0.08 : 0.1,
        },
      },
      isSensor: true,
    });
    this.masks.push(mask);
    Matter.World.add(this.world, mask);
  }

  getRandomPosition() {
    let randomX = Math.floor(Math.random() * this.width);
    let randomY = Math.floor(Math.random() * this.height);
    return {
      x: randomX,
      y: randomY,
    };
  }

  removeMask(maskIndex) {
    Matter.World.remove(this.world, this.masks[maskIndex]);
    this.masks.splice(maskIndex, 1);
  }

  handleMasks() {
    let maskIndex = this.isGettingNewMask();
    if (maskIndex !== -1) {
      this.decreaseInfectionChanceByOneMask();
      this.removeMask(maskIndex);
    }
  }

  isGettingNewMask() {
    for (let i = 0; i < this.masks.length; i++) {
      if (Matter.Bounds.contains(this.userDot.bounds, this.masks[i].position)) {
        return i;
      }
    }
    return -1;
  }

  decreaseInfectionChanceByOneMask() {
    this.thisUserChanceOfInfection -= 10;
  }

  increaseInfectionChanceByOneMask() {
    this.thisUserChanceOfInfection += 10;
  }

  resetInfectionStatus() {
    this.bots.forEach((bot) => (bot.label = this.particleStatus.UNINFECTED));
  }

  resetPositions() {
    this.bots.forEach((bot) =>
      Matter.Body.setPosition(bot, {
        x: this.botInitLocationX,
        y: this.botInitLocationY,
      })
    );
    Matter.Body.setPosition(this.userDot, { x: 50, y: 50 });
    this.externalUsers.forEach((dot) =>
      Matter.Body.setPosition(dot, { x: 50, y: 50 })
    );
  }

  setTargetPosition(username, position) {
    this.moveBodyTo(this.externalUsers.get(username), position);
  }

  createUser(username) {
    this.thisUserLabel = username;
    this.userDot = Matter.Bodies.circle(
      50,
      50,
      window.innerWidth < 700 ? 10 : 20,
      {
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        force: { x: 0, y: 0 },
        render: {
          strokeStyle: this.userColor,
          fillStyle: "transparent",
          lineWidth: 3,
        },
        label: username,
      }
    );

    Matter.World.add(this.world, [this.userDot]);
    return this;
  }

  createRender() {
    this.render = Matter.Render.create({
      canvas: this.canvasElement,
      engine: this.engine,
      options: {
        width: this.width,
        height: this.height,
        wireframes: false,
        showAngleIndicator: true,
        background: "#2c373d",
      },
    });
  }

  getUserColor(username) {
    if (username === this.thisUserLabel) {
      return this.userColor;
    } else {
      return this.externalUsers.get(username).render.strokeStyle;
    }
  }

  createMouse() {
    this.mouse = Matter.Mouse.create(this.render.canvas);
    this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
      mouse: this.mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: true,
        },
      },
    });
  }

  addBot() {
    let particle = Matter.Bodies.circle(
      this.botInitLocationX,
      this.botInitLocationY,
      this.botRadius,
      {
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        force: { x: 0, y: 0 },
        render: {
          strokeStyle: this.botColorHealthy,
          fillStyle: this.botColorHealthy,
          lineWidth: 3,
        },
      }
    );
    this.bots.push(particle);
    Matter.World.add(this.world, [particle]);
    return this;
  }

  subscribeMouseMoveCallbacks() {
    Matter.Events.on(this.mouseConstraint, "mousedown", () => {
      console.log(this.mouseConstraint.body);
      if (
        this.mouseConstraint.body &&
        this.mouseConstraint.body.label === this.particleStatus.INFECTED
      ) {
        this.stop = true;
        this.bots.forEach((bot) =>
          Matter.Body.setVelocity(bot, { x: 0, y: 0 })
        );
      }
    });

    this.mouseMoveCallbacks.forEach((callback) => {
      Matter.Events.on(this.mouseConstraint, "mousemove", () => {
        callback(this.mouse);
      });
    });
  }

  isUserDotInfected() {
    return this.bots.some((bot) => {
      return (
        bot.label === this.particleStatus.INFECTED &&
        this.distance(bot, this.userDot) < this.transmissionDistance
      );
    });
  }

  addInfectedCallback(callback) {
    this.infectedCallbacks.push(callback);
    return this;
  }

  addUpdateCallback(callback) {
    this.updateCallbacks.push(callback);
    return this;
  }

  addMouseMoveCallback(callback) {
    this.mouseMoveCallbacks.push(callback);
    return this;
  }

  addBots(n) {
    for (let i = 0; i < n; i++) {
      this.addBot();
    }
    return this;
  }

  stopMovement() {
    clearInterval(this.moveMovementInterval);
    this.bots.forEach((bot) => Matter.Body.setVelocity(bot, { x: 0, y: 0 }));
  }

  startInfecting() {
    this.bots[0].label = this.particleStatus.INFECTED;
    return this;
  }

  distance(dot1, dot2) {
    return (
      (dot1.position.x - dot2.position.x) *
        (dot1.position.x - dot2.position.x) +
      (dot1.position.y - dot2.position.y) * (dot1.position.y - dot2.position.y)
    );
  }

  updateInfectionStatus() {
    for (let i = 0; i < this.bots.length; i++) {
      for (let j = i + 1; j < this.bots.length; j++) {
        if (
          this.distance(this.bots[i], this.bots[j]) > this.transmissionDistance
        ) {
          continue;
        }
        if (
          this.bots[i].label === this.particleStatus.INFECTED ||
          this.bots[j].label === this.particleStatus.INFECTED
        ) {
          this.bots[i].label = this.particleStatus.INFECTED;
          this.bots[j].label = this.particleStatus.INFECTED;
        }
      }
    }
  }

  updateParticlesColors() {
    this.bots.forEach((bot) => {
      if (bot.label === this.particleStatus.INFECTED) {
        bot.render.fillStyle = this.botColorInfected;
        bot.render.strokeStyle = this.botColorInfected;
      }
    });
  }

  moveBodyTo(body, position) {
    let targetAngle = Matter.Vector.angle(body.position, position);
    let force = window.innerWidth < 700 ? 0.003 : 0.015;
    Matter.Body.setVelocity(body, { x: 0, y: 0 });
    Matter.Body.applyForce(body, body.position, {
      x: Math.cos(targetAngle) * force,
      y: Math.sin(targetAngle) * force,
    });
    Matter.Body.setAngle(body, targetAngle);
  }

  handleMouseMove(mouse) {
    this.moveBodyTo(this.userDot, mouse.position);
  }

  startParticlesMovementsAndTransmission(timeout) {
    this.moveMovementInterval = setInterval(() => {
      if (!this.stop) moveAllDotsRandomly(this.bots);
      this.updateInfectionStatus();
      this.updateParticlesColors();
      if (this.isUserDotInfected()) {
        this.infectedCallbacks.forEach((callback) =>
          callback(Math.random() < 1 - this.thisUserChanceOfInfection / 100)
        );
      }
      this.updateCallbacks.forEach((callback) => callback(this.mouse));
      this.handleMasks();
    }, timeout || 60);
    return this;
  }

  run() {
    this.createRender();
    this.createMouse();
    this.addMouseMoveCallback(this.handleMouseMove.bind(this));
    this.subscribeMouseMoveCallbacks();
    this.addWalls();

    Matter.Render.run(this.render);
    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);

    return this;
  }

  addWalls() {
    let top = Matter.Bodies.rectangle(this.width / 2, 0, this.width, 2, {
      isStatic: true,
    });
    let bottom = Matter.Bodies.rectangle(
      this.width / 2,
      this.height,
      this.width,
      2,
      {
        isStatic: true,
      }
    );
    let left = Matter.Bodies.rectangle(0, this.height / 2, 2, this.height, {
      isStatic: true,
    });
    let right = Matter.Bodies.rectangle(
      this.width,
      this.height / 2,
      2,
      this.height,
      { isStatic: true }
    );
    Matter.World.add(this.world, [top, bottom, left, right]);
  }

  setBotParticleOptions({ radius, color }) {
    this.botRadius = radius;
    this.colroRadius = radius;
    return this;
  }

  setCanvasElement(canvasElement) {
    this.canvasElement = canvasElement;
    return this;
  }

  setWidthAndHeight(width, height) {
    this.width = width;
    this.height = height;
    this.botInitLocationX = width / 2;
    this.botInitLocationY = height / 2;
    return this;
  }
}
