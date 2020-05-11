let signUpSubmitBtn = document.getElementById("signUpSubmitBtn");

const createCube = () => {
  const template = document.getElementById("cube-template");
  const fragment = document.importNode(template.content, true);
  return fragment;
};

console.log(createCube());
console.log("Hello");

const getDistance = (state, rotate) =>
  ["x", "y"].reduce((object, axis) => {
    object[axis] = Math.abs(state[axis] + rotate[axis]);
    return object;
  }, {});

const getRotation = (state, size, rotate) => {
  const axis = rotate.x ? "Z" : "Y";
  const direction = rotate.x > 0 ? -1 : 1;

  return `
    rotateX(${state.x + rotate.x}deg)
    rotate${axis}(${direction * (state.y + rotate.y)}deg)
    translateZ(${size / 2}px)
  `;
};

// Linear interpolation between a and b
// Example: (100, 200, .5) = 150
const interpolate = (a, b, i) => a * (1 - i) + b * i;

const getShading = (tint, rotate, distance) => {
  const darken = ["x", "y"].reduce((object, axis) => {
    const delta = distance[axis];
    const ratio = delta / 180;
    object[axis] = delta > 180 ? Math.abs(2 - ratio) : ratio;
    return object;
  }, {});

  if (rotate.x) darken.y = 0;
  else {
    const { x } = distance;
    if (x > 90 && x < 270)
      directions.forEach((axis) => (darken[axis] = 1 - darken[axis]));
  }

  const alpha = (darken.x + darken.y) / 2;
  const blend = (value, index) =>
    Math.round(interpolate(value, tint.shading[index], alpha));

  const [r, g, b] = tint.color.map(blend);
  return `rgb(${r}, ${g}, ${b})`;
};
