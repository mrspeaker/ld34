"use strict";
/*global THREE:false*/
import Hairs from "./Hairs";

window.addEventListener("load", () => {
  bindEvents();
  onWindowResize();
  tick();
});

const container = document.getElementById("container");

const world = (() => {
  const scene = new THREE.Scene();
  const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
  const camera = new THREE.PerspectiveCamera(60, resolution.x / resolution.y, .1, 100);
  camera.position.set(0, 0, -10);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(resolution.x, resolution.y);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();

  return {
    scene,
    resolution,
    camera,
    renderer,
    clock,
    controls,
    raycaster
  };
})();


const COMMANDS = {
  "none": "",
  "draw": "draw",
  "erase": "erase"
};

const game = {
  dude: addObjectToScene(makeDude()),
  hairs: [],
  command: COMMANDS.none,
  mouse: new THREE.Vector2(0, 0),
  world
};

game.dude.position.set(0.3, 0.56, 0.005);

function onWindowResize() {
  const {clientWidth:w, clientHeight:h} = container;
  const {camera, renderer, resolution} = world;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);
  resolution.set(w, h);
}

function bindEvents () {
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("keydown", e => {
    if (e.shiftKey) { game.command = COMMANDS.draw; }
    if (e.metaKey) { game.command = COMMANDS.erase; }
  });
  window.addEventListener("keyup", e => {
    const {command} = game;
    if (command == COMMANDS.draw && !e.shiftKey) game.command = COMMANDS.none;
    if (command == COMMANDS.erase && !e.metaKey) game.command = COMMANDS.none;
  });
  window.addEventListener("mousemove", e => {
    const {renderer} = world;
    const {mouse, command} = game;
    mouse.x = (e.clientX / (renderer.domElement.width / window.devicePixelRatio)) * 2 - 1;
    mouse.y = - (e.clientY / (renderer.domElement.height / window.devicePixelRatio)) * 2 + 1;

    if (command !== COMMANDS.none) {
      handleHairCommand();
    }
  });
}

const hairMaterials = (() => {
  const {resolution, camera} = world;
  const hairColors = [
    0x443542, 0x533D46, 0x2F2432,
    0x3C2E3B, 0x5D4951, 0x8C5D5D
  ];
  return hairColors.map(c => new THREE.MeshLineMaterial({
    color: new THREE.Color(c),
    opacity: 1,
    resolution: resolution,
    lineWidth: 6,
    near: camera.near,
    far: camera.far,
    depthTest: true,
    blending: THREE.NormalBlending,
    sizeAttenuation: false,
    side: THREE.DoubleSide
  }));
})();

function addObjectToScene (obj) {
  world.scene.add(obj);
  return obj;
}

function addHairToWorld (hair) {
  game.hairs.push(addObjectToScene(hair));
  return hair;
}

function makeDude () {
  const geometry = new THREE.PlaneGeometry(7, 7, 16);
  const texture = new THREE.TextureLoader().load("./assets/man.png");
  const material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0xffeeff});
  const plane = new THREE.Mesh(geometry, material);
  return plane;
}

function spawnHair (parentUserData, position) {
  const {clock} = world;
  const mesh = Hairs.make(parentUserData, hairMaterials, clock.getElapsedTime());
  Hairs.position(mesh, position);
  return addHairToWorld(mesh);
}

function handleHairCommand () {
  const {camera, raycaster} = world;
  const {dude, mouse} = game;
  raycaster.setFromCamera(mouse, camera);

  switch (game.command) {

  case COMMANDS.draw:
    const intersects = raycaster.intersectObjects([dude], false);
    if (intersects.length > 0) {
      spawnHair(null, intersects[0].point);
    }
    break;

  case COMMANDS.erase:
    break;
  }
}

function tick () {
  requestAnimationFrame(tick);

  const {clock, scene, renderer, controls, camera} = world;
  const dt = clock.getDelta();
  const t = clock.getElapsedTime();
  const {hairs} = game;
  controls.update();

  let doRemove = false;
  hairs.forEach((hair) => {
    Hairs.update(hair, dt, t, spawnHair);
    if (hair.userData.remove) {
      doRemove = true;
    }
  });

  if (doRemove) {
    game.hairs = hairs.filter(hair => {
      if (hair.userData.remove) {
        scene.remove(hair);
        return false;
      }
      return true;
    });
  }
  renderer.render(scene, camera);
}
