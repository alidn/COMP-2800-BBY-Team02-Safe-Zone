var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Composites = Matter.Composites,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  World = Matter.World,
  Bodies = Matter.Bodies;

// create engine
let engine = Engine.create();
let world = engine.world;
world.gravity = { x: 0, y: 0, scale: 0 };

// create renderer
let render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    // showAngleIndicator: true,
    wireframeBackground: "#fff",
    background: "transparent",
    wireframes: false,
  },
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

function createDot(color, radius) {
  let dot = Bodies.circle(50, 50, radius || 20, {
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    force: {
      x: (Math.random() / 10) * (Math.random() < 0.5 ? -1 : 1),
      y: (Math.random() / 10) * (Math.random() < 0.5 ? -1 : 1),
    },
    render: {
      fillStyle: color || "green",
    },
  });
  return dot;
}

World.add(world, [
  Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
  Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
  Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
  Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
]);

let userDot = createDot("Orange", 30);
let kidDot = createDot("grey", 50);
kidDot.isSensor = true;
let anotherDot = createDot("black", 10);
kidDot.render.opacity = 0.2;
Matter.Body.setParts(userDot, [userDot, kidDot, anotherDot]);
World.add(world, userDot);
// World.add(world, kidDot);

// add mouse control
var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
    // body: userDot,
  });

Matter.Events.on(mouseConstraint, "mousedown", () => {
  let image = document.getElementById("image");
  image.hidden = false;
  image.style.top = mouse.mousedownPosition.y;
  image.style.left = mouse.mousedownPosition.x;
  setTimeout(() => {
    image.hidden = true;
  }, 500);
  userDot.velocity = {
    x: 0,
    y: 0,
  };
  let velocity = {
    x: (mouse.mousedownPosition.x - userDot.position.x) / 100,
    y: (mouse.mousedownPosition.y - userDot.position.y) / 100,
  };

  Matter.Body.setVelocity(userDot, velocity);
});

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

let dots = [];

for (let i = 0; i < 20; i++) {
  let dot = createDot();
  dots.push(dot);
}

for (let i = 0; i < dots.length; i++) {
  let dot = dots[i];
  World.add(world, dot);
}

// fit the render viewport to the scene
Render.lookAt(render, {
  min: { x: 0, y: 0 },
  max: { x: 800, y: 600 },
});

let isInfected = [];
for (let i = 0; i < dots.length; i++) {
  isInfected[i] = false;
}
isInfected[0] = true;
for (let i = 0; i < dots.length; i++) {
  if (isInfected[i]) {
    dots[i].render.fillStyle = "red";
  }
}

setTimeout(() => {
  setInterval(() => {
    for (let i = 0; i < dots.length; i++) {
      for (let j = 0; j < dots.length; j++) {
        if (i === j) continue;
        // console.log(distance(dots[i], dots[j]));
        if (distance(dots[i], dots[j]) < 10000) {
          if (isInfected[i]) {
            isInfected[j] = true;
          }
          if (isInfected[j]) {
            isInfected[i] = true;
          }
        }
      }
    }
    for (let i = 0; i < dots.length; i++) {
      if (isInfected[i]) {
        dots[i].render.fillStyle = "red";
      }
      dots[i].force = {
        x: (Math.random() / 500) * (Math.random() < 0.5 ? -1 : 1),
        y: (Math.random() / 500) * (Math.random() < 0.5 ? -1 : 1),
      };
    }
  }, 0.5);
}, 1000);

function distance(dot1, dot2) {
  return (
    (dot1.position.x - dot2.position.x) * (dot1.position.x - dot2.position.x) +
    (dot1.position.y - dot2.position.y) * (dot1.position.y - dot2.position.y)
  );
}
