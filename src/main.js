/*global THREE:false*/
import Hairs from "./Hairs";
import World from "./World";
import demo from "./demo";

window.addEventListener("load", () => {
  bindEvents();
  onWindowResize();
  tick();
});

const COMMANDS = {
  "none": "",
  "draw": "draw",
  "erase": "erase"
};

const world = World(document.getElementById("container"));

const game = {
  dude: addObjectToScene(makeDude()),
  glasses: addObjectToScene(makeGlasses()),
  hairs: [],
  command: COMMANDS.none,
  mouse: new THREE.Vector2(0, 0),
  noseHairs: [...demo]
};

game.dude.position.set(0.3, 0.56, -0.09);
game.glasses.position.set(0.75 , 1.05, -5.2);

const hairMaterials = (({resolution, camera}) => {
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
    //blending: THREE.NormalBlending,
    sizeAttenuation: false,
    //side: THREE.DoubleSide
  }));
})(world);

function onWindowResize() {
  const {camera, renderer, resolution, container} = world;
  const {clientWidth:w, clientHeight:h} = container;
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
    const {resolution} = world;
    const {mouse, command} = game;

    mouse.x = (e.clientX / resolution.x) * 2 - 1;
    mouse.y = - (e.clientY / resolution.y) * 2 + 1;

    if (command !== COMMANDS.none) {
      handleHairCommand();
    }
  });
}

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
  const loader = new THREE.TextureLoader();
  loader.crossOrigin = "";
  const texture = loader.load("./assets/man.png");
  //const texture = loader.load("http://i.imgur.com/0yPZxSP.jpg");
  const material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map:texture, transparent:true});
  const plane = new THREE.Mesh(geometry, material);
  return plane;
}

function makeGlasses () {
  const geometry = new THREE.PlaneGeometry(3.5, 3.5, 16);
  const loader = new THREE.TextureLoader();
  const texture = loader.load("./assets/glasses.png");
  const material = new THREE.MeshBasicMaterial({map:texture, transparent:true});
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

// Demo nose hairs
function doNoseHairs (t) {
  let {noseHairs} = game;
  if (noseHairs.length) {
    if (noseHairs[0].time < t) {
      spawnHair(null, noseHairs[0]);
      game.noseHairs = noseHairs.slice(1);
    }
  }
}

function tick () {
  requestAnimationFrame(tick);

  const {clock, scene, renderer, controls, camera} = world;
  const {hairs} = game;

  const dt = clock.getDelta();
  const t = clock.getElapsedTime();
  controls.update();

  doNoseHairs(t);

  // Update all hairs
  const doRemove = hairs.reduce((remove, hair) => {
    Hairs.update(hair, dt, t, spawnHair);
    return remove || hair.userData.remove;
  }, false);

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
