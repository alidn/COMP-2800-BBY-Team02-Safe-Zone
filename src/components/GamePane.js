import Matter from "matter-js";
import {
  moveAllDotsRandomly,
  addBorder,
  updateColorsBasedOnStatus,
  updateStatusBasedOnDistance,
} from "./dots";

/**
 * Class GamePane.
 */
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

  /**
   * Create an external user (this is used for the multiplayer mode)
   * @param {String} username - the username
   * @returns {GamePane}
   */
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
    Matter.World.add(this.world, [newUserDot]);
    return this;
  }

  /**
   * Creates a mask and puts in a random position on the pane.
   * @param {Number} limit - the maximum number of masks that can be on the pane
   * at the same time.
   */
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

  /**
   * Generates and returns a random position on the pane.
   * @returns {{x: number, y: number}}
   */
  getRandomPosition() {
    let randomX = Math.floor(Math.random() * this.width);
    let randomY = Math.floor(Math.random() * this.height);
    return {
      x: randomX,
      y: randomY,
    };
  }

  /**
   * Removes a mask with the given maskIndex from the pane and the
   * array of masks.
   * @param {Number} maskIndex - the index of the mask
   */
  removeMask(maskIndex) {
    Matter.World.remove(this.world, this.masks[maskIndex]);
    this.masks.splice(maskIndex, 1);
  }

  /**
   * Checks if the user id getting a new mask and returns
   */
  handleMasks() {
    let maskIndex = this.isGettingNewMask();
    if (maskIndex !== -1) {
      this.decreaseInfectionChanceByOneMask();
      this.removeMask(maskIndex);
    }
  }

  /**
   * Returns whether or not the the current player is getting a mask.
   * @returns {number} - negative 1 if the user is not getting a mask, and
   * the index of the task if the user is getting a mask.
   */
  isGettingNewMask() {
    for (let i = 0; i < this.masks.length; i++) {
      if (Matter.Bounds.contains(this.userDot.bounds, this.masks[i].position)) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Decreases the infectino chance by one mask (10 percent)
   */
  decreaseInfectionChanceByOneMask() {
    this.thisUserChanceOfInfection -= 10;
  }

  /**
   * Increases the infection chance by one mask (10 percent)
   */
  increaseInfectionChanceByOneMask() {
    this.thisUserChanceOfInfection += 10;
  }

  /**
   * Resets the infection chance to 100.
   */
  resetInfectionStatus() {
    this.bots.forEach((bot) => (bot.label = this.particleStatus.UNINFECTED));
  }

  /**
   * Puts all the dots in their initial position.
   */
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

  /**
   * Sets a target position for the given user and position. When this function
   * is called the dot of the given user start moving toward the given position.
   * @param {String} username -
   * @param {Object} position -
   */
  setTargetPosition(username, position) {
    this.moveBodyTo(this.externalUsers.get(username), position);
  }

  /**
   * Creates a new user in the pane. This function should only be called once.
   * @param {String} username
   * @returns {GamePane}
   */
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

  /**
   * Creates a rendered.
   */
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

  /**
   * Returns the color of the user with the given username.
   * @param {String} username
   * @returns {string|*}
   */
  getUserColor(username) {
    if (username === this.thisUserLabel) {
      return this.userColor;
    } else {
      return this.externalUsers.get(username).render.strokeStyle;
    }
  }

  /**
   * Creates mouse.
   */
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

  /**
   * Adds a bot on the pane.
   * @returns {GamePane}
   */
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

  /**
   * Subscribes all the mouse callbacks to the mousedown and mousemove events.
   */
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

  /**
   * Returns whether or not the user dot is currently infected.
   * @returns {boolean}
   */
  isUserDotInfected() {
    return this.bots.some((bot) => {
      return (
        bot.label === this.particleStatus.INFECTED &&
        this.distance(bot, this.userDot) < this.transmissionDistance
      );
    });
  }

  /**
   * Adds the given callback (for the infection event) to the list of callbacks.
   * @param callback
   * @returns {GamePane}
   */
  addInfectedCallback(callback) {
    this.infectedCallbacks.push(callback);
    return this;
  }

  /**
   * Adds a callbacks for the render update event to the list of callbacks.
   * @param callback
   * @returns {GamePane}
   */
  addUpdateCallback(callback) {
    this.updateCallbacks.push(callback);
    return this;
  }

  /**
   * Adds a mouse-move callback to the list of callbacks.
   * @param callback
   * @returns {GamePane}
   */
  addMouseMoveCallback(callback) {
    this.mouseMoveCallbacks.push(callback);
    return this;
  }

  /**
   * Adds n bots to the pane.
   * @param {Number} n - the number of dots to add.
   * @returns {GamePane}
   */
  addBots(n) {
    for (let i = 0; i < n; i++) {
      this.addBot();
    }
    return this;
  }

  /**
   * Stops the movement of all the dots. This function also stops rendering.
   */
  stopMovement() {
    clearInterval(this.moveMovementInterval);
    this.bots.forEach((bot) => Matter.Body.setVelocity(bot, { x: 0, y: 0 }));
  }

  /**
   * Infects one dot randomly.
   * @returns {GamePane}
   */
  startInfecting() {
    this.bots[0].label = this.particleStatus.INFECTED;
    return this;
  }

  /**
   * Returns the distancce between two dots.
   * @param dot1
   * @param dot2
   * @returns {number}
   */
  distance(dot1, dot2) {
    return (
      (dot1.position.x - dot2.position.x) *
        (dot1.position.x - dot2.position.x) +
      (dot1.position.y - dot2.position.y) * (dot1.position.y - dot2.position.y)
    );
  }

  /**
   * updates the status of the dots based on their distance. When this function is
   * called some dots might get infected, but their color doesn't change.
   * @param {Array<Object>} dots - the list of dots.
   */
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

  /**
   * Updates the color of the dots based on their status.
   */
  updateParticlesColors() {
    this.bots.forEach((bot) => {
      if (bot.label === this.particleStatus.INFECTED) {
        bot.render.fillStyle = this.botColorInfected;
        bot.render.strokeStyle = this.botColorInfected;
      }
    });
  }

  /**
   * Moves the given body (dot) to the given position.
   * @param body
   * @param position
   */
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

  /**
   * Handles mouse move.
   * @param mouse
   */
  handleMouseMove(mouse) {
    this.moveBodyTo(this.userDot, mouse.position);
  }

  /**
   * The heart of the beast! iteratively renders the pane (the default is 60 ms)
   * @param timeout
   * @returns {GamePane}
   */
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

  /**
   * Starts the game.
   * @returns {GamePane}
   */
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

  /**
   * Adds the pane walls.
   */
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

  /**
   * Changes the properties of the NPC.
   * @param radius
   * @param color
   * @returns {GamePane}
   */
  setBotParticleOptions({ radius, color }) {
    this.botRadius = radius;
    this.colroRadius = radius;
    return this;
  }

  /**
   * Sets the current canvas element to the given element.
   * @param canvasElement
   * @returns {GamePane}
   */
  setCanvasElement(canvasElement) {
    this.canvasElement = canvasElement;
    return this;
  }

  /**
   * Sets the width and height of the pane.
   * @param width
   * @param height
   * @returns {GamePane}
   */
  setWidthAndHeight(width, height) {
    this.width = width;
    this.height = height;
    this.botInitLocationX = width / 2;
    this.botInitLocationY = height / 2;
    return this;
  }
}
