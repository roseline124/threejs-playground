import * as THREE from "three";

/**
 * modelMatrix: local to world
 * viewMatrix: world to camera
 * projectionMatrix: vertex in camera to clip space
 * modelViewMatrix: combines the result of the modelMatrix and viewMatrix
 *
 * matrix is 4x4 matrix
 * vec4 is 4x1 matrix
 *
 *
 */
const vshader = `
void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position * 0.5, 1.0);
}
`;

/**
 * fragment color is a vec4(r, g, b, a)
 */
const fshader = `
uniform vec3 u_color;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

void main() {
  vec3 color = vec3(u_mouse.x / u_resolution.x, u_mouse.y / u_resolution.y, 0.0);
  gl_FragColor = vec4(color, 1.0);
}
`;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10); // left, right, top, bottom, near, far

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 2); // plane is two triangles

const uniforms = {
  u_time: { value: 0.0 },
  u_mouse: { value: { x: 0.0, y: 0.0 } },
  u_resolution: { value: { x: 0.0, y: 0.0 } },
  u_color: { value: new THREE.Color(0, 1, 1) },
};

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: vshader,
  fragmentShader: fshader,
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 1;

onWindowResize();

if ("ontouchstart" in window) {
  // mobile
  window.addEventListener("touchmove", move);
} else {
  window.addEventListener("resize", onWindowResize, false);
  window.addEventListener("mousemove", move);
}

animate();

function onWindowResize(event) {
  const aspectRatio = window.innerWidth / window.innerHeight;
  let width, height;
  if (aspectRatio >= 1) {
    width = 1;
    height = (window.innerHeight / window.innerWidth) * width;
  } else {
    width = aspectRatio;
    height = 1;
  }
  camera.left = -width;
  camera.right = width;
  camera.top = height;
  camera.bottom = -height;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (uniforms.u_resolution) {
    uniforms.u_resolution.value.x = window.innerWidth;
    uniforms.u_resolution.value.y = window.innerHeight;
  }
}

function move(e) {
  // support touch move
  uniforms.u_mouse.value.x = e.touches ? e.touches[0].clientX : e.clientX;
  uniforms.u_mouse.value.y = e.touches ? e.touches[0].clientY : e.clientY;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
