import Matter from "matter-js";

const Bodies = Matter.Bodies;
const width = window.innerWidth;

export const DOTS_INIITAL_LOCATION = {
  x: 50,
  y: 50,
};
export const INIT_FORCE_COEFFICIENT = width < 700 ? 700 : 100;
export const MOVEMENT_FORCE_COEFFICIENT = width < 700 ? 10000 : 1300;
export const status = {
  UNINFECTED: "uninfected",
  INFECTED: "infected",
  RECOVERED: "recovered",
};
export const colors = {
  USER: "#2884E0",
  UNINFECTED: "#60e68f",
  INFECTED: "#e66060",
  RECOVERED: "yellow",
  BORDER: "grey",
  ENEMY: "orange",
};
export const BORDER_OPACITY = 0.4;
export const sizes = {
  USER_RADIUS: width < 700 ? 5 : 10,
  BORDER_RADIUS: width < 700 ? 15 : 45,
  BOT_RADIUS: width < 700 ? 5 : 10,
};
export const TRANSMISION_DISTANCE = 10000;

/**
 * Creates a dot given the properties. If the properties are not passed,
 * the default values will be used.
 * @param {Object} loc - the location of the dot.
 * @param {Number} radius - the radius of the dot.
 * @param {String} color - the color of the dot.
 * @returns {Body}
 */
export function createDot({ loc, radius, color }) {
  let dot = Bodies.circle(
    loc.x || DOTS_INIITAL_LOCATION.x,
    loc.y || DOTS_INIITAL_LOCATION.y,
    radius || sizes.BOT_RADIUS,
    {
      friction: 0,
      frictionAir: 0,
      force: { x: 0, y: 0 },
      render: {
        strokeStyle: color || colors.UNINFECTED,
        fillStyle: "transparent",
        lineWidth: 5,
      },
      label: status.UNINFECTED,
      opacity: 0.3,
    }
  );
  return dot;
}

/**
 * Adds a border to a dot, given a radius and colour. If the properties are
 * not passed, the default values are used.
 * @param dot
 * @param {Number} radius - the radius of the border.
 * @param {String} color - the color of the border.
 */
export function addBorder(dot, { radius, color }) {
  let borderDot = createDot(
    radius || sizes.BORDER_RADIUS,
    color || colors.BORDER
  );
  borderDot.isSensor = true;
  borderDot.render.opacity = BORDER_OPACITY;

  // TODO: The inner dot properties should be the same as 'dot'.
  let innerDot = createDot({
    loc: {},
    radius: sizes.BORDER_RADIUS,
  });
  Matter.Body.setParts(dot, [dot, borderDot, innerDot]);
}

/**
 * updates the color of the dots based on their status (infected, uninfected)
 * @param {Array<Object>} dots - the list of dots.
 */
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

/**
 * updates the status of the dots based on their distance. When this function is
 * called some dots might get infected, but their color doesn't change.
 * @param {Array<Object>} dots - the list of dots.
 */
export function updateStatusBasedOnDistance(dots) {
  for (let i = 0; i < dots.length; i++) {
    for (let j = 0; j < dots.length; j++) {
      if (i === j) continue;
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

/**
 * Returns if a dot is infected or not.
 * @param dot
 * @returns {boolean}
 */
export function isInfected(dot) {
  return dot.label === status.INFECTED;
}

/**
 * Makes a dot infected by changing its label, this function does not change
 * the color of the dot.
 * @param dot
 */
export function makeInfected(dot) {
  dot.label = status.INFECTED;
}

/**
 * This function makes a dot recovered, but does not change its color. j4
 * @param dot
 */
export function makeRecovered(dot) {
  dot.label = status.RECOVERED;
}

/**
 * This function moves all dots in random directions with random speed.
 * If this function is not called continuously the dots will eventually stop moving.
 * @param dots - the list of dots.
 */
export function moveAllDotsRandomly(dots) {
  dots.forEach((dot) => moveInRandomDirection(dot));
}

/**
 * Moves a single dot in a random direction with a random speed.
 * @param dot - the dot to move.
 */
function moveInRandomDirection(dot) {
  dot.force = getRandomMovementForce();
}

/**
 * Returns the distance between two dots.
 * @param dot1
 * @param dot2
 * @returns {number} the distance of the two dots.
 */
function distance(dot1, dot2) {
  return (
    (dot1.position.x - dot2.position.x) * (dot1.position.x - dot2.position.x) +
    (dot1.position.y - dot2.position.y) * (dot1.position.y - dot2.position.y)
  );
}

/**
 * Generates and returns a random force. This function is use at the beginning.
 * of the game.
 * @returns {{x: number, y: number}}
 */
export function getRandomInitialForce() {
  return getForce(INIT_FORCE_COEFFICIENT);
}

/**
 * Generates and returns random force.
 * @returns {{x: number, y: number}}
 */
export function getRandomMovementForce() {
  return getForce(MOVEMENT_FORCE_COEFFICIENT);
}

/**
 * Returns a random force with the given coefficient.
 * @param forceCoefficient
 * @returns {{x: number, y: number}}
 */
export function getForce(forceCoefficient) {
  return {
    x: (Math.random() / forceCoefficient) * (Math.random() < 0.5 ? -1 : 1),
    y: (Math.random() / forceCoefficient) * (Math.random() < 0.5 ? -1 : 1),
  };
}

/**
 * Creates and returns n dots.
 * @param {Number} n - the number of dots.
 * @param isPaused - whether or not the game is paused.
 * @returns {Array<Object>}
 */
export function createNDots(n, isPaused) {
  let dots = [];

  for (let i = 0; i < n; i++) {
    let dot = createDot(undefined, undefined, isPaused);
    dots.push(dot);
  }

  return dots;
}
