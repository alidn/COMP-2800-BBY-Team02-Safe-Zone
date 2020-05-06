// eslint-disable-next-line no-undef
var Engine = Matter.Engine,
  // eslint-disable-next-line no-undef
  Render = Matter.Render,
  // eslint-disable-next-line no-undef
  Runner = Matter.Runner,
  // eslint-disable-next-line no-undef
  MouseConstraint = Matter.MouseConstraint,
  // eslint-disable-next-line no-undef
  Mouse = Matter.Mouse,
  // eslint-disable-next-line no-undef
  World = Matter.World,
  // eslint-disable-next-line no-undef
  Bodies = Matter.Bodies;

import {
  createDot,
  sizes,
  colors,
  addBorder,
  makeInfected,
  makeRecovered,
  updateColorsBasedOnStatus,
  updateStatusBasedOnDistance,
  moveAllDotsRandomly,
} from "./dots.js";

const NUMBER_OF_DOTS = 10;
const RENDER_PAUSE = 10;

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

// add walls
World.add(world, [
  Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
  Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
  Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
  Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
]);

let userDot = createDot(sizes.USER_RADIUS, colors.USER);
addBorder(userDot);

World.add(world, userDot);

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

for (let i = 0; i < NUMBER_OF_DOTS; i++) {
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

makeInfected(dots[0]);
updateColorsBasedOnStatus(dots);

let firstTime = true;

setTimeout(() => {
  setInterval(() => {
    updateStatusBasedOnDistance(dots);
    updateColorsBasedOnStatus(dots);
    moveAllDotsRandomly(dots);
  }, RENDER_PAUSE);
}, 3000);

// setTimeout(() => {
//   setInterval(() => {
//     for (let i = 0; i < dots.length; i++) {
//       for (let j = 0; j < dots.length; j++) {
//         if (i === j) continue;
//         if (distance(dots[i], dots[j]) < 10000) {
//           if (isInfected[i]) {
//             isInfected[j] = true;
//           }
//           if (isInfected[j]) {
//             isInfected[i] = true;
//           }
//         }
//       }
//     }
//     for (let i = 0; i < dots.length; i++) {
//       if (isInfected[i]) {
//         dots[i].render.fillStyle = "red";
//         dots[i].label = "Infected";
//       }
//       dots[i].force = {
//         x: (Math.random() / 3000) * (Math.random() < 0.5 ? -1 : 1),
//         y: (Math.random() / 3000) * (Math.random() < 0.5 ? -1 : 1),
//       };
//     }
//     firstTime = false;
//   }, 0.5);
// }, 1000);

// }

// Matter.Events.on(engine, "collisionActive", function (param) {
//   let arr = param.source.pairs.collisionActive;
//   // console.log(param.source.pairs);
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i].bodyA.id === kidDot.id || arr[i].bodyB.id === kidDot.id) {
//       if (
//         arr[i].bodyA.label === "Infected" ||
//         arr[i].bodyB.label === "Infected"
//       ) {
//         // if (firstTime) break;
//         showLoseMessage();
//         break;
//       }
//     }
//   }
// });

// Matter.Events.on(engine, "collisionEnd", function (param) {
//   let arr = param.source.pairs.collisionEnd;
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i].bodyA.id === kidDot.id || arr[i].bodyB.id === kidDot.id) {
//       if (
//         arr[i].bodyA.label === "Infected" ||
//         arr[i].bodyB.label === "Infected"
//       ) {
//         // if (firstTime) break;
//         showLoseMessage();
//         break;
//       }
//     }
//   }
// });

// Matter.Events.on(engine, "collisionStart", function (param) {
//   let arr = param.source.pairs.collisionStart;
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i].bodyA.id === kidDot.id || arr[i].bodyB.id === kidDot.id) {
//       if (
//         arr[i].bodyA.label === "Infected" ||
//         arr[i].bodyB.label === "Infected"
//       ) {
//         // if (firstTime) break;
//         showLoseMessage();
//         break;
//       }
//     }
//   }
// });

let showMessage = true;
function showLoseMessage() {
  if (showMessage) {
    alert("you lost");
    // console.log("You lost");
    // location.reload();
  }
  showMessage = false;
}
