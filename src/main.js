import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shader.js";

// scene, camera, renderer 기본 설정
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// plane mesh 생성
const geometry = new THREE.PlaneGeometry(2, 2);
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

renderer.render(scene, camera);
