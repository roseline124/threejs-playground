import * as THREE from "three";

const vshader = `
varying vec2 v_uv;
varying vec3 v_position;

void main() {	
  v_uv = uv;
  v_position = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
const fshader = `
#define PI 3.14159265359
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 v_uv;
varying vec3 v_position;


float circle(vec2 pt, vec2 center, float radius, float line_width, float edge_thickness){
  pt -= center;
  float len = length(pt);
  float result = smoothstep(radius-line_width/2.0-edge_thickness, radius-line_width/2.0, len) - smoothstep(radius + line_width/2.0, radius + line_width/2.0 + edge_thickness, len);

  return result;
}

float line(float x, float y, float line_width, float edge_thickness){
  return smoothstep(x-line_width/2.0-edge_thickness, x-line_width/2.0, y) - smoothstep(x+line_width/2.0, x+line_width/2.0+edge_thickness, y);
}

float sweep(vec2 pt, vec2 center, float radius, float line_width, float edge_thickness){
  vec2 d = pt - center;
  float theta = u_time * 2.0;
  vec2 p = vec2(cos(theta), -sin(theta))*radius;
  float h = clamp( dot(d,p)/dot(p,p), 0.0, 1.0 );
  //float h = dot(d,p)/dot(p,p);
  float l = length(d - p*h);

  float gradient = 0.0;
  const float gradient_angle = PI * 0.5;

  if (length(d)<radius){
    float angle = mod(theta + atan(d.y, d.x), PI2);
    gradient = clamp(gradient_angle - angle, 0.0, gradient_angle)/gradient_angle * 0.5;
  }

  return gradient + 1.0 - smoothstep(line_width, line_width+edge_thickness, l);
}

float polygon(vec2 pt, vec2 center, float radius, int sides, float rotate, float edge_thickness){
  pt -= center;
  
  // Angle and radius from the current pixel
  float theta = atan(pt.y, pt.x) + rotate;
  float rad = PI2/float(sides);

  // Shaping function that modulate the distance
  float d = cos(floor(0.5 + theta/rad)*rad-theta)*length(pt);

  return 1.0 - smoothstep(radius, radius + edge_thickness, d);
}

void main (void)
{
  vec3 axis_color = vec3(0.8);
  vec3 color = line(v_uv.y, 0.5, 0.002, 0.001) * axis_color;
  color += line(v_uv.x, 0.5, 0.002, 0.001) * axis_color;
  color += circle(v_uv, vec2(0.5), 0.3, 0.002, 0.001) * axis_color;
  color += circle(v_uv, vec2(0.5), 0.2, 0.002, 0.001) * axis_color;
  color += circle(v_uv, vec2(0.5), 0.1, 0.002, 0.001) * axis_color;
  color += sweep(v_uv, vec2(0.5), 0.3, 0.003, 0.001) * vec3(0.1, 0.3, 0.1);
  gl_FragColor = vec4(color, 1.0); 
}
`;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();

const geometry = new THREE.PlaneGeometry(2, 2);
const uniforms = {
  u_color_a: { value: new THREE.Color(0xff0000) },
  u_color_b: { value: new THREE.Color(0x00ffff) },
  u_time: { value: 0.0 },
  u_mouse: { value: { x: 0.0, y: 0.0 } },
  u_resolution: { value: { x: 0, y: 0 } },
};

const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vshader,
  fragmentShader: fshader,
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 1;

onWindowResize();
if ("ontouchstart" in window) {
  document.addEventListener("touchmove", move);
} else {
  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("mousemove", move);
}

function move(evt) {
  uniforms.u_mouse.value.x = evt.touches ? evt.touches[0].clientX : evt.clientX;
  uniforms.u_mouse.value.y = evt.touches ? evt.touches[0].clientY : evt.clientY;
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
  uniforms.u_resolution.value.x = window.innerWidth;
  uniforms.u_resolution.value.y = window.innerHeight;
}

function animate() {
  requestAnimationFrame(animate);
  uniforms.u_time.value += clock.getDelta();
  renderer.render(scene, camera);
}
