/*global THREE:false*/
import Maf from "../vendor/Maf";

let curveGeomCache = [];

function update (hair, dt, t, onSpawn) {

  const hairUpdateTime = 0.1;
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
    const newPos = {
      x: position.x + (0.5 - Math.random()) * 0.1,
      y: position.y + (0.5 - Math.random()) * 0.1
    };
    onSpawn(userData, newPos);
  }

}

function make (parent, materials, time = 0) {
  const g = new THREE.MeshLine();
  g.setGeometry(getGeometry(), p => 1 - p);

  const material = materials[Maf.randomInRange(0, materials.length) | 0];
  const mesh = new THREE.Mesh(g.geometry, material);

  const {userData: h} = mesh;
  h.life = 0;
  h.lastGrow = parent ? parent.lastGrow : time;
  h.growSpeed = 0.05;
  h.sprout = false;
  h.generation = parent ? parent.generation + 1 : 1;
  h.sproutTime = h.generation + (Math.random() * 2);
  h.fallRotateSpeed = -(5 - Math.random() * 8) + 2;
  h.fallAge = Maf.randomInRange(18, 30);

  return mesh;
}


function position (mesh, point) {
  mesh.position.set(point.x, point.y, -0.1);
  const length = Math.random() * 0.01;
  const xdepth = length / 5;
  const zdepth = length / 1;
  mesh.scale.set(xdepth, length, zdepth);
}

function getGeometry () {

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


export default {
  update,
  make,
  position
};
