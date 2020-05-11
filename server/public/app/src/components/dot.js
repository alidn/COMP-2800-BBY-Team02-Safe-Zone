import Matter from "matter-js";

let Bodies = Matter.Bodies;

const DOTS_INIITAL_LOCATION = {
  x: 50,
  y: 50,
};
export const INIT_FORCE_COEFFICIENT = 1000;
export const MOVEMENT_FORCE_COEFFICIENT = 10000;
export const status = {
  UNINFECTED: "uninfected",
  INFECTED: "infected",
  RECOVERED: "recovered",
};
export const colors = {
  USER: "black",
  UNINFECTED: "green",
  INFECTED: "red",
  RECOVERED: "yellow",
  BORDER: "grey",
  ENEMY: "orange",
};
export const BORDER_OPACITY = 0.2;
export const sizes = {
  USER_RADIUS: 5,
  BORDER_RADIUS: 25,
  BOT_RADIUS: 5,
};
export const TRANSMISION_DISTANCE = 10000;

export function createDot(radius, color, isPaused) {
  let dot = Bodies.circle(
    DOTS_INIITAL_LOCATION.x,
    DOTS_INIITAL_LOCATION.y,
    radius || sizes.BOT_RADIUS,
    {
      friction: 0,
      frictionAir: 0,
      force: isPaused ? { x: 0, y: 0 } : getRandomInitialForce(),
      render: {
        fillStyle: color || colors.UNINFECTED,
      },
      label: status.UNINFECTED,
    }
  );
  return dot;
}

export function addBorder(dot, borderRadius, color) {
  let borderDot = createDot(
    borderRadius || sizes.BORDER_RADIUS,
    color || colors.BORDER
  );
  borderDot.isSensor = true;
  borderDot.render.opacity = BORDER_OPACITY;

  // TODO: The inner dot properties should be the same as dot.
  let innerDot = createDot(sizes.USER_RADIUS, colors.USER);
  Matter.Body.setParts(dot, [dot, borderDot, innerDot]);
}

export function updateColorsBasedOnStatus(dots) {
  dots.forEach((dot) => {
    let newColor;
    switch (dot.label) {
      case status.INFECTED:
        newColor = colors.INFECTED;
        break;
      case status.UNINFECTED:
        newColor = colors.UNINFECTED;
        break;
      case status.RECOVERED:
        newColor = colors.RECOVERED;
    }
    dot.render.fillStyle = newColor;
  });
}

export function updateStatusBasedOnDistance(dots) {
  for (let i = 0; i < dots.length; i++) {
    for (let j = 0; j < dots.length; j++) {
      if (i == j) continue;
      if (distance(dots[i], dots[j]) < TRANSMISION_DISTANCE) {
        if (isInfected(dots[i]) || isInfected(dots[j])) {
          makeInfected(dots[i]);
          makeInfected(dots[j]);
        }
      }
    }
  }
  updateColorsBasedOnStatus(dots);
}

export function isInfected(dot) {
  return dot.label === status.INFECTED;
}

export function makeInfected(dot) {
  dot.label = status.INFECTED;
}

export function makeRecovered(dot) {
  dot.label = status.RECOVERED;
}

export function moveAllDotsRandomly(dots) {
  dots.forEach((dot) => moveInRandomDirection(dot));
}

function moveInRandomDirection(dot) {
  dot.force = getRandomMovementForce();
}

function distance(dot1, dot2) {
  return (
    (dot1.position.x - dot2.position.x) * (dot1.position.x - dot2.position.x) +
    (dot1.position.y - dot2.position.y) * (dot1.position.y - dot2.position.y)
  );
}

export function getRandomInitialForce() {
  return getForce(INIT_FORCE_COEFFICIENT);
}

export function getRandomMovementForce() {
  return getForce(MOVEMENT_FORCE_COEFFICIENT);
}

export function getForce(forceCoefficient) {
  return {
    x: (Math.random() / forceCoefficient) * (Math.random() < 0.5 ? -1 : 1),
    y: (Math.random() / forceCoefficient) * (Math.random() < 0.5 ? -1 : 1),
  };
}

export function createNDots(n, isPaused) {
  let dots = [];

  for (let i = 0; i < n; i++) {
    let dot = createDot(undefined, undefined, isPaused);
    dots.push(dot);
  }

  return dots;
}
