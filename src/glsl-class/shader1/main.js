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

void main() {
  gl_FragColor = vec4(u_color, 1.0);
}
`;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10); // left, right, top, bottom, near, far

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 2); // plane is two triangles

const uniforms = {
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

window.addEventListener("resize", onWindowResize, false);

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
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
