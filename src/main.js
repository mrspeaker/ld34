"use strict";
/*global THREE:false, Maf:false*/

window.addEventListener("load", () => {
  bindEvents();
  onWindowResize();
  tick();
});

const container = document.getElementById("container");

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
const mouse = new THREE.Vector2(0, 0);

let lines = [];
let curveGeomCache = [];
const dude = addObject(makeDude());

const hairUpdateTime = 0.1;

const COMMANDS = {
  "none": "",
  "draw": "draw",
  "erase": "erase"
};

let drawCommand = COMMANDS.none;

const colors = [
  0x443542,
  0x533D46,
  0x2F2432,
  0x3C2E3B,
  0x5D4951,
  0x8C5D5D
];

function onWindowResize() {
  const w = container.clientWidth;
  const h = container.clientHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);
  resolution.set(w, h);
}

function bindEvents () {
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("keydown", e => {
    if (e.ctrlKey) { drawCommand = COMMANDS.draw; }
    if (e.metaKey) { drawCommand = COMMANDS.erase; }
  });
  window.addEventListener("keyup", e => {
    if (drawCommand == COMMANDS.draw && !e.ctrlKey) drawCommand = COMMANDS.none;
    if (drawCommand == COMMANDS.erase && !e.metaKey) drawCommand = COMMANDS.none;
  });
  window.addEventListener("mousemove", e => {
    if (drawCommand === COMMANDS.none) {
      return;
    }
    mouse.x = (e.clientX / (renderer.domElement.width / window.devicePixelRatio)) * 2 - 1;
    mouse.y = - (e.clientY / (renderer.domElement.height / window.devicePixelRatio)) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    if (drawCommand === COMMANDS.draw) {
      const intersects = raycaster.intersectObjects([dude], false);
      if (intersects.length > 0) {
        const mesh = makeLine(createCurve());
        addLine(mesh);
        positionLine(mesh, intersects[0].point);
      }
    }
    if (drawCommand === COMMANDS.erase) {
      const intersects = raycaster.intersectObjects(lines, true);
      if (intersects.length > 0) {
        //
      }
    }
  });
}

function positionLine (mesh, point) {
  mesh.position.set(point.x, point.y, -0.1);
  const length = Math.random() * 0.01;
  const xdepth = length / 5;
  const zdepth = length / 1;
  mesh.scale.set(xdepth, length, zdepth);
}

function createCurve () {

  if (curveGeomCache.length > 100) {
    return curveGeomCache[Math.random() * curveGeomCache.length - 1 | 0];
  }

  const r =  Maf.randomInRange;
  const s = new THREE.ConstantSpline();
  s.inc = 0.05;
  s.p0 = new THREE.Vector3(0, 0, 0);
  s.p1 = s.p0.clone().add(new THREE.Vector3(r(-0.2, 0.2), 0, 0));
  s.p2 = s.p1.clone().add(new THREE.Vector3(r(-100.5, 100.5), -1, 0));
  s.p3 = s.p2.clone().add(new THREE.Vector3(r(-100.2, 100.2), 0.1, -20));

  s.calculate();
  s.calculateDistances();
  //s.reticulate({ distancePerStep: .1 });
  s.reticulate({ steps: 15 });
  const geometry = new THREE.Geometry();
  for(let j = 0; j < s.lPoints.length - 1; j++) {
    geometry.vertices.push(s.lPoints[ j ].clone());
  }

  curveGeomCache.push(geometry);
  return geometry;

}

const hairMaterials = colors.map(c => {
  return new THREE.MeshLineMaterial({
    color: new THREE.Color(c),
    opacity: 1,
    resolution: resolution,
    lineWidth: 6,
    near: camera.near,
    far: camera.far,
    depthTest: true,
    blending: THREE.NormalBlending,
    sizeAttenuation: false,
    //transparent: params.strokes,
    side: THREE.DoubleSide
  });
});

function makeLine (geo, parent) {
  const g = new THREE.MeshLine();
  g.setGeometry(geo, p => 1 - p);

  const material = hairMaterials[Maf.randomInRange(0, colors.length) | 0];
  const mesh = new THREE.Mesh(g.geometry, material);

  const {userData: h} = mesh;
  h.life = 0;
  h.lastGrow = (parent ? parent.lastGrow : clock.getElapsedTime()) - (Math.random() * hairUpdateTime);
  h.growSpeed = 0.05;
  h.sprout = false;
  h.generation = parent ? parent.generation + 1 : 1;
  h.sproutTime = h.generation + (Math.random() * 2);
  h.fallRotateSpeed = -(5 - Math.random() * 8) + 2;
  h.fallAge = Maf.randomInRange(18, 30);

  return mesh;
}

function addObject (obj) {
  scene.add(obj);
  return obj;
}

function addLine (line) {
  lines.push(addObject(line));
  return line;
}

function makeDude () {
  const geometry = new THREE.PlaneGeometry(7, 7, 16);
  const texture = new THREE.TextureLoader().load("./assets/man.png");
  const material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0xffeeff, map: texture});
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(0.3, 0.56, 0.005);
  return plane;
}

function updateHair (hair, dt, t) {

  const {userData, scale, position, rotation} = hair;
  const {sprout, sproutTime, lastGrow, growSpeed} = userData;
  const growTime = t - lastGrow;
  userData.life += dt;
  if (growTime < hairUpdateTime) {
    return;
  }
  userData.lastGrow = t;

  const {x, y, z} = scale;
  if (userData.life > userData.fallAge + 5) {
    userData.remove = true;
  }

  if (userData.life > userData.fallAge) {
    position.set(position.x, position.y - (Math.pow(userData.life, 4) / 25000) * dt, position.z);
    rotation.set(rotation.x + userData.fallRotateSpeed * dt, rotation.y, rotation.x);
  }

  // Stop growing
  if (userData.life > userData.fallAge - 5) {
    return;
  }

  scale.set(x, y + growSpeed * growTime, z);
  if (!sprout && userData.life > sproutTime && userData.generation < 6) {
    userData.sprout = true;
    const mesh = makeLine(createCurve(), userData);
    const x = position.x + (0.5 - Math.random()) * 0.1;
    const y = position.y + (0.5 - Math.random()) * 0.1;
    positionLine(mesh, {x, y});
    addLine(mesh);
  }

}

function tick () {
  requestAnimationFrame(tick);

  const dt = clock.getDelta();
  const t = clock.getElapsedTime();
  controls.update();

  let doRemove = false;
  lines.forEach((hair) => {
    updateHair(hair, dt, t);
    if (hair.userData.remove) {
      doRemove = true;
    }
  });

  if (doRemove) {
    lines = lines.filter(l => {
      if (l.userData.remove) {
        scene.remove(l);
        return false;
      }
      return true;
    });
  }
  renderer.render(scene, camera);
}
