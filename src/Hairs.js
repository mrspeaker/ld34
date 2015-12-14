/*global THREE:false*/
import {randomInRange as rnd} from "../vendor/Maf";

let hairGeomCache = [];

function update (hair, dt, t, onSpawn) {
  const {userData, scale, position, rotation} = hair;
  const {life, lastGrow, growAge, fallAge} = userData;
  const hairUpdateTime = 0.1;
  const growDelta = t - lastGrow;
  userData.life += dt;

  // Don't update every frame
  if (growDelta < hairUpdateTime) {
    return;
  }
  userData.lastGrow = t;

  // Fall down the screen
  if (life > fallAge) {
    const {fallRotateSpeed} = userData;
    const fallSpeed = Math.pow(life, 4) / Math.pow(10, 4 + 1);

    position.set(position.x, position.y - fallSpeed * growDelta, position.z);
    rotation.set(rotation.x + fallRotateSpeed * growDelta, rotation.y, rotation.x);
    scale.set(scale.x, Math.max(0.001, scale.y - (1 * growDelta)), scale.z);
  }

  // Remove from the scene (after X seconds)
  if (life > fallAge + 2) {
    userData.remove = true;
  }

  // Stop growing
  if (life > growAge) {
    return;
  }

  // Grow!
  const {generation, sproutTime, sprout, growSpeed} = userData;

  scale.set(scale.x, scale.y + growSpeed * growDelta, scale.z);
  if (!sprout && life > sproutTime && generation < 6) {
    userData.sprout = true;
    const newPos = {
      x: position.x + rnd(-0.1, 0.1),
      y: position.y + rnd(-0.1, 0.1)
    };
    onSpawn(userData, newPos);
  }
}

function make (parent, materials, time = 0) {
  const g = new THREE.MeshLine();
  g.setGeometry(getGeometry(), p => 1 - p);

  const material = materials[rnd(0, materials.length) | 0];
  const mesh = new THREE.Mesh(g.geometry, material);

  const {userData: h} = mesh;
  h.life = 0;
  h.lastGrow = parent ? parent.lastGrow : time;
  h.growSpeed = 0.05;
  h.sprout = false;
  h.generation = parent ? parent.generation + 1 : 1;
  h.sproutTime = h.generation + rnd(0, 2);
  h.fallRotateSpeed = rnd(-4, 4);
  h.fallAge = rnd(18, 30);
  h.growAge = rnd(h.fallAge * 0.5, h.fallAge);

  return mesh;
}

function position (mesh, {x, y}) {
  mesh.position.set(x, y, -0.1);
  const length = rnd(0, 0.01);
  const xScale = length * 20;
  const zScale = length * 20;
  mesh.scale.set(xScale, length, zScale);
}

function getGeometry () {
  if (hairGeomCache.length > 100) {
    return hairGeomCache[rnd(0, hairGeomCache.length - 1) | 0];
  }

  const s = new THREE.ConstantSpline();
  s.inc = 0.05;
  s.p0 = new THREE.Vector3(0, 0, 0);
  s.p1 = s.p0.clone().add(new THREE.Vector3(rnd(-0.2, 0.2), 0, 0));
  s.p2 = s.p1.clone().add(new THREE.Vector3(rnd(-1, 1), -1, 0));
  s.p3 = s.p2.clone().add(new THREE.Vector3(rnd(-1, 1), 0.1, rnd(0, -1)));

  s.calculate();
  s.calculateDistances();
  // Reticulating splines! Woo!
  s.reticulate({ steps: 15 });
  const geometry = new THREE.Geometry();
  for(let j = 0; j < s.lPoints.length - 1; j++) {
    geometry.vertices.push(s.lPoints[ j ].clone());
  }

  hairGeomCache.push(geometry);
  return geometry;
}

export default {
  update,
  make,
  position
};
