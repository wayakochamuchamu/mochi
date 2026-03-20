import * as THREE from 'https://esm.sh/three@0.160.0';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

// シーン
const scene = new THREE.Scene();

// カメラ
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 10, -15);
camera.lookAt(0, -5, -5);

// レンダラー
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// CSS（重要）
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.style.touchAction = "none";

// ライト
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 2, -1);
scene.add(light);

const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
keyLight.position.set(3, 5, 2);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-3, 3, 2);
scene.add(fillLight);

const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
backLight.position.set(0, 5, -5);
scene.add(backLight);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// モデル
const loader = new GLTFLoader();
let mochi;

loader.load('mochi.glb', (gltf) => {
  console.log("読み込み成功！");
  mochi = gltf.scene;
  scene.add(mochi);
});

// ぷにぷに
let target = 0;
let current = 0;

// ✅ canvasにイベントを付ける
const canvas = renderer.domElement;

canvas.addEventListener("pointerdown", () => {
  target = 1;
});

canvas.addEventListener("pointerup", () => {
  target = 0;
});

canvas.addEventListener("pointerleave", () => {
  target = 0;
});

// アニメーション
function animate() {
  requestAnimationFrame(animate);

  current += (target - current) * 0.1;

  if (mochi) {
    mochi.traverse((child) => {
      if (child.isMesh && child.morphTargetInfluences) {
        child.morphTargetInfluences[0] = current;
      }
    });
  }

  renderer.render(scene, camera);
}

animate();
