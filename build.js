(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _main = require("./src/main");

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _main2.default;

},{"./src/main":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Maf = require("../vendor/Maf");

var _Maf2 = _interopRequireDefault(_Maf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var curveGeomCache = []; /*global THREE:false*/

function update(hair, dt, t, onSpawn) {

  var hairUpdateTime = 0.1;
  var userData = hair.userData;
  var scale = hair.scale;
  var position = hair.position;
  var rotation = hair.rotation;
  var sprout = userData.sprout;
  var sproutTime = userData.sproutTime;
  var lastGrow = userData.lastGrow;
  var growSpeed = userData.growSpeed;

  var growTime = t - lastGrow;
  userData.life += dt;

  if (growTime < hairUpdateTime) {
    return;
  }
  userData.lastGrow = t;

  var x = scale.x;
  var y = scale.y;
  var z = scale.z;

  if (userData.life > userData.fallAge + 5) {
    userData.remove = true;
  }

  if (userData.life > userData.fallAge) {
    position.set(position.x, position.y - Math.pow(userData.life, 4) / 25000 * dt, position.z);
    rotation.set(rotation.x + userData.fallRotateSpeed * dt, rotation.y, rotation.x);
    scale.set(scale.x, Math.max(0, scale.y - 10 * dt), scale.z);
    //console.log(scale.x.toFixed(2), scale.y.toFixed(2))
  }

  // Stop growing
  if (userData.life > userData.growAge) {
    return;
  }

  scale.set(x, y + growSpeed * growTime, z);
  if (!sprout && userData.life > sproutTime && userData.generation < 6) {
    userData.sprout = true;
    var newPos = {
      x: position.x + (0.5 - Math.random()) * 0.1,
      y: position.y + (0.5 - Math.random()) * 0.1
    };
    onSpawn(userData, newPos);
  }
}

function make(parent, materials) {
  var time = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  var g = new THREE.MeshLine();
  g.setGeometry(getGeometry(), function (p) {
    return 1 - p;
  });

  var material = materials[_Maf2.default.randomInRange(0, materials.length) | 0];
  var mesh = new THREE.Mesh(g.geometry, material);

  var h = mesh.userData;

  h.life = 0;
  h.lastGrow = parent ? parent.lastGrow : time;
  h.growSpeed = 0.05;
  h.sprout = false;
  h.generation = parent ? parent.generation + 1 : 1;
  h.sproutTime = h.generation + Math.random() * 2;
  h.fallRotateSpeed = -(5 - Math.random() * 8) + 2;
  h.fallAge = _Maf2.default.randomInRange(18, 30);
  h.growAge = _Maf2.default.randomInRange(h.fallAge * 0.5, h.fallAge);

  return mesh;
}

function position(mesh, point) {
  mesh.position.set(point.x, point.y, -0.1);
  var length = Math.random() * 0.01;
  var xdepth = length * 20;
  var zdepth = length * 20;
  mesh.scale.set(xdepth, length, zdepth);
}

function getGeometry() {

  if (curveGeomCache.length > 100) {
    return curveGeomCache[Math.random() * curveGeomCache.length - 1 | 0];
  }

  var r = _Maf2.default.randomInRange;
  var s = new THREE.ConstantSpline();
  s.inc = 0.05;
  s.p0 = new THREE.Vector3(0, 0, 0);
  s.p1 = s.p0.clone().add(new THREE.Vector3(r(-0.2, 0.2), 0, 0));
  s.p2 = s.p1.clone().add(new THREE.Vector3(r(-1, 1), -1, 0));
  s.p3 = s.p2.clone().add(new THREE.Vector3(r(-1, 1), 0.1, r(0, -1)));

  s.calculate();
  s.calculateDistances();
  //s.reticulate({ distancePerStep: .1 });
  s.reticulate({ steps: 15 });
  var geometry = new THREE.Geometry();
  for (var j = 0; j < s.lPoints.length - 1; j++) {
    geometry.vertices.push(s.lPoints[j].clone());
  }

  curveGeomCache.push(geometry);
  return geometry;
}

exports.default = {
  update: update,
  make: make,
  position: position
};

},{"../vendor/Maf":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = [{
  "time": 2.2470199999999987,
  "x": 1.1296554230256284,
  "y": 0.035673327675036615
}, {
  "time": 2.293439999999999,
  "x": 1.1296554230256284,
  "y": 0.035673327675036615
}, {
  "time": 2.365325,
  "x": 1.1296554230256284,
  "y": 0.030916883985031562
}, {
  "time": 2.405095,
  "x": 1.1296554230256284,
  "y": 0.026160440295026843
}, {
  "time": 2.43793,
  "x": 1.1296554230256284,
  "y": 0.021403996605021902
}, {
  "time": 2.455055,
  "x": 1.1248989791392048,
  "y": 0.021403996605022013
}, {
  "time": 2.4740550000000003,
  "x": 1.1248989791392052,
  "y": 0.01664755291501674
}, {
  "time": 2.491855,
  "x": 1.1201425352527812,
  "y": 0.01664755291501696
}, {
  "time": 2.5080450000000005,
  "x": 1.1153860913663576,
  "y": 0.01189110922501202
}, {
  "time": 2.524140000000001,
  "x": 1.1153860913663576,
  "y": 0.007134665535007079
}, {
  "time": 2.5429800000000005,
  "x": 1.1106296474799335,
  "y": 0.0023782218450025816
}, {
  "time": 2.5575300000000003,
  "x": 1.10587320359351,
  "y": 0.0023782218450022485
}, {
  "time": 2.5752450000000007,
  "x": 1.1011167597070863,
  "y": 0.0023782218450023596
}, {
  "time": 2.6002600000000005,
  "x": 1.1011167597070863,
  "y": 0.0023782218450023596
}, {
  "time": 2.6171450000000003,
  "x": 1.1011167597070863,
  "y": -0.0023782218450025816
}, {
  "time": 2.6338950000000003,
  "x": 1.0963603158206623,
  "y": -0.0023782218450026926
}, {
  "time": 2.650685000000001,
  "x": 1.0916038719342391,
  "y": -0.0023782218450026926
}, {
  "time": 2.678010000000001,
  "x": 1.0868474280478146,
  "y": -0.0023782218450025816
}, {
  "time": 2.717020000000001,
  "x": 1.0820909841613915,
  "y": -0.0023782218450025816
}, {
  "time": 2.7387050000000017,
  "x": 1.0820909841613915,
  "y": -0.007134665535007412
}, {
  "time": 2.7581350000000016,
  "x": 1.0773345402749679,
  "y": -0.007134665535007301
}, {
  "time": 2.782770000000001,
  "x": 1.0773345402749679,
  "y": -0.01189110922501213
}, {
  "time": 2.811110000000001,
  "x": 1.0725780963885443,
  "y": -0.01189110922501213
}, {
  "time": 2.870400000000002,
  "x": 1.0725780963885443,
  "y": -0.01189110922501213
}, {
  "time": 3.8087900000000086,
  "x": 0.6159594832918691,
  "y": 0.040429771365041445
}, {
  "time": 3.833570000000009,
  "x": 0.6159594832918691,
  "y": 0.040429771365041445
}, {
  "time": 3.8582300000000087,
  "x": 0.6112030394054452,
  "y": 0.040429771365041556
}, {
  "time": 3.875820000000009,
  "x": 0.6112030394054452,
  "y": 0.045186215055046386
}, {
  "time": 3.906895000000009,
  "x": 0.6064465955190216,
  "y": 0.045186215055046275
}, {
  "time": 3.933615000000009,
  "x": 0.6064465955190217,
  "y": 0.049942658745051105
}, {
  "time": 3.952315000000009,
  "x": 0.6016901516325981,
  "y": 0.04994265874505133
}, {
  "time": 3.9748250000000094,
  "x": 0.6016901516325981,
  "y": 0.04994265874505133
}, {
  "time": 4.0204650000000095,
  "x": 0.5969337077461742,
  "y": 0.049942658745051105
}, {
  "time": 4.058980000000008,
  "x": 0.5921772638597504,
  "y": 0.049942658745051216
}, {
  "time": 4.101140000000007,
  "x": 0.5874208199733266,
  "y": 0.049942658745051216
}, {
  "time": 4.156350000000007,
  "x": 0.5826643760869032,
  "y": 0.049942658745050994
}, {
  "time": 4.338535000000007,
  "x": 0.5874208199733266,
  "y": 0.049942658745051216
}, {
  "time": 4.361260000000007,
  "x": 0.5969337077461742,
  "y": 0.045186215055046275
}, {
  "time": 4.374230000000005,
  "x": 0.5969337077461744,
  "y": 0.040429771365041556
}, {
  "time": 4.391675000000006,
  "x": 0.601690151632598,
  "y": 0.040429771365041556
}, {
  "time": 4.406990000000006,
  "x": 0.6064465955190217,
  "y": 0.035673327675036504
}, {
  "time": 4.4249200000000055,
  "x": 0.6064465955190216,
  "y": 0.030916883985031673
}, {
  "time": 4.441995000000006,
  "x": 0.6112030394054452,
  "y": 0.02616044029502662
}, {
  "time": 4.459800000000006,
  "x": 0.6112030394054452,
  "y": 0.02616044029502662
}, {
  "time": 4.494045000000005,
  "x": 0.6159594832918691,
  "y": 0.021403996605021902
}, {
  "time": 4.525770000000005,
  "x": 0.6207159271782928,
  "y": 0.021403996605021902
}, {
  "time": 4.534250000000005,
  "x": 0.6254723710647162,
  "y": 0.01664755291501685
}, {
  "time": 4.558135000000005,
  "x": 0.6254723710647163,
  "y": 0.01189110922501202
}, {
  "time": 4.5685750000000045,
  "x": 0.6302288149511401,
  "y": 0.01189110922501202
}, {
  "time": 4.585350000000004,
  "x": 0.6349852588375641,
  "y": 0.0023782218450023596
}, {
  "time": 4.606395000000003,
  "x": 0.6397417027239877,
  "y": 0.0023782218450025816
}, {
  "time": 4.637525000000003,
  "x": 0.6444981466104112,
  "y": 0.0023782218450025816
}, {
  "time": 4.6616050000000016,
  "x": 0.6444981466104112,
  "y": 0.0023782218450025816
}, {
  "time": 4.678455000000001,
  "x": 0.6444981466104112,
  "y": -0.0023782218450026926
}, {
  "time": 4.6957900000000015,
  "x": 0.6492545904968349,
  "y": -0.0023782218450024706
}, {
  "time": 4.713350000000001,
  "x": 0.6540110343832586,
  "y": -0.007134665535007301
}, {
  "time": 4.730135000000001,
  "x": 0.6540110343832585,
  "y": -0.011891109225012353
}, {
  "time": 4.755985,
  "x": 0.6587674782696825,
  "y": -0.011891109225012353
}, {
  "time": 4.768974999999999,
  "x": 0.6587674782696825,
  "y": -0.016647552915017294
}, {
  "time": 4.804529999999999,
  "x": 0.6587674782696826,
  "y": -0.02140399660502179
}, {
  "time": 4.862959999999998,
  "x": 0.6587674782696823,
  "y": -0.026160440295026954
}, {
  "time": 4.894039999999999,
  "x": 0.6587674782696823,
  "y": -0.026160440295026954
}, {
  "time": 4.926434999999997,
  "x": 0.6587674782696824,
  "y": -0.030916883985031895
}, {
  "time": 4.958194999999997,
  "x": 0.6587674782696825,
  "y": -0.035673327675036726
}, {
  "time": 4.975309999999997,
  "x": 0.6635239221561057,
  "y": -0.035673327675036726
}];

},{}],4:[function(require,module,exports){
"use strict"
/*global THREE:false*/
;

var _Hairs = require("./Hairs");

var _Hairs2 = _interopRequireDefault(_Hairs);

var _demo = require("./demo");

var _demo2 = _interopRequireDefault(_demo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noseHairs = _demo2.default.slice(0);

window.addEventListener("load", function () {
  bindEvents();
  onWindowResize();
  tick();
});

var container = document.getElementById("container");

var world = (function () {
  var scene = new THREE.Scene();
  var resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
  var camera = new THREE.PerspectiveCamera(60, resolution.x / resolution.y, .1, 100);
  camera.position.set(0, 0, -10);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(resolution.x, resolution.y);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  var clock = new THREE.Clock();
  var raycaster = new THREE.Raycaster();

  return {
    scene: scene,
    resolution: resolution,
    camera: camera,
    renderer: renderer,
    clock: clock,
    controls: controls,
    raycaster: raycaster
  };
})();

var COMMANDS = {
  "none": "",
  "draw": "draw",
  "erase": "erase"
};

var game = {
  dude: addObjectToScene(makeDude()),
  glasses: addObjectToScene(makeGlasses()),
  hairs: [],
  command: COMMANDS.none,
  mouse: new THREE.Vector2(0, 0),
  world: world
};

game.dude.position.set(0.3, 0.56, -0.09);
game.glasses.position.set(0.75, 1.05, -5.2);

function onWindowResize() {
  var w = container.clientWidth;
  var h = container.clientHeight;
  var camera = world.camera;
  var renderer = world.renderer;
  var resolution = world.resolution;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);
  resolution.set(w, h);
}

function bindEvents() {
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("keydown", function (e) {
    if (e.shiftKey) {
      game.command = COMMANDS.draw;
    }
    if (e.metaKey) {
      game.command = COMMANDS.erase;
    }
  });
  window.addEventListener("keyup", function (e) {
    var command = game.command;

    if (command == COMMANDS.draw && !e.shiftKey) game.command = COMMANDS.none;
    if (command == COMMANDS.erase && !e.metaKey) game.command = COMMANDS.none;
  });
  window.addEventListener("mousemove", function (e) {
    var renderer = world.renderer;
    var mouse = game.mouse;
    var command = game.command;

    mouse.x = e.clientX / (renderer.domElement.width / window.devicePixelRatio) * 2 - 1;
    mouse.y = -(e.clientY / (renderer.domElement.height / window.devicePixelRatio)) * 2 + 1;

    if (command !== COMMANDS.none) {
      handleHairCommand();
    }
  });
}

var hairMaterials = (function () {
  var resolution = world.resolution;
  var camera = world.camera;

  var hairColors = [0x443542, 0x533D46, 0x2F2432, 0x3C2E3B, 0x5D4951, 0x8C5D5D];
  return hairColors.map(function (c) {
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
      side: THREE.DoubleSide
    });
  });
})();

function addObjectToScene(obj) {
  world.scene.add(obj);
  return obj;
}

function addHairToWorld(hair) {
  game.hairs.push(addObjectToScene(hair));
  return hair;
}

function makeDude() {
  var geometry = new THREE.PlaneGeometry(7, 7, 16);
  var loader = new THREE.TextureLoader();
  loader.crossOrigin = "";
  var texture = loader.load("./assets/man.png");
  //const texture = loader.load("http://i.imgur.com/0yPZxSP.jpg");
  var material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture, transparent: true });
  var plane = new THREE.Mesh(geometry, material);
  return plane;
}

function makeGlasses() {
  var geometry = new THREE.PlaneGeometry(3.5, 3.5, 16);
  var loader = new THREE.TextureLoader();
  var texture = loader.load("./assets/glasses.png");
  var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  var plane = new THREE.Mesh(geometry, material);
  return plane;
}

function spawnHair(parentUserData, position) {
  var clock = world.clock;

  var mesh = _Hairs2.default.make(parentUserData, hairMaterials, clock.getElapsedTime());
  _Hairs2.default.position(mesh, position);
  return addHairToWorld(mesh);
}

window.poop = [];
function handleHairCommand() {
  var camera = world.camera;
  var raycaster = world.raycaster;
  var dude = game.dude;
  var mouse = game.mouse;

  raycaster.setFromCamera(mouse, camera);

  switch (game.command) {

    case COMMANDS.draw:
      var intersects = raycaster.intersectObjects([dude], false);
      if (intersects.length > 0) {
        window.poop.push({
          time: world.clock.getElapsedTime(),
          x: intersects[0].point.x,
          y: intersects[0].point.y
        });
        spawnHair(null, intersects[0].point);
      }
      break;

    case COMMANDS.erase:
      break;
  }
}

function tick() {
  requestAnimationFrame(tick);

  var clock = world.clock;
  var scene = world.scene;
  var renderer = world.renderer;
  var controls = world.controls;
  var camera = world.camera;

  var dt = clock.getDelta();
  var t = clock.getElapsedTime();

  if (noseHairs.length) {
    if (noseHairs[0].time < t) {
      spawnHair(null, noseHairs[0]);
      noseHairs = noseHairs.slice(1);
    }
  }

  var hairs = game.hairs;

  controls.update();

  var doRemove = false;
  hairs.forEach(function (hair) {
    _Hairs2.default.update(hair, dt, t, spawnHair);
    if (hair.userData.remove) {
      doRemove = true;
    }
  });

  if (doRemove) {
    game.hairs = hairs.filter(function (hair) {
      if (hair.userData.remove) {
        scene.remove(hair);
        return false;
      }
      return true;
    });
  }
  renderer.render(scene, camera);
}

},{"./Hairs":2,"./demo":3}],5:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var Maf = (function () {

    // Module code from underscore.js

    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    var root = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self.self === self && self || (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global.global === global && global || this;

    var Maf = function Maf(obj) {
        if (obj instanceof Maf) return obj;
        if (!(this instanceof Maf)) return new Maf(obj);
        this._wrapped = obj;
    };

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for their old module API. If we're in
    // the browser, add `Maf` as a global object.
    // (`nodeType` is checked to ensure that `module`
    // and `exports` are not HTML elements.)
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = Maf;
        }
        exports.Maf = Maf;
    } else {
        root.Maf = Maf;
    }

    // Current version.
    Maf.VERSION = '1.0.0';

    Maf.PI = Math.PI;

    // https://www.opengl.org/sdk/docs/man/html/clamp.xhtml

    Maf.clamp = function (v, minVal, maxVal) {
        return Math.min(maxVal, Math.max(minVal, v));
    };

    // https://www.opengl.org/sdk/docs/man/html/step.xhtml

    Maf.step = function (edge, v) {
        return v < edge ? 0 : 1;
    };

    // https://www.opengl.org/sdk/docs/man/html/smoothstep.xhtml

    Maf.smoothStep = function (edge0, edge1, v) {
        var t = Maf.clamp((v - edge0) / (edge1 - edge0), 0.0, 1.0);
        return t * t * (3.0 - 2.0 * t);
    };

    // http://docs.unity3d.com/ScriptReference/Mathf.html
    // http://www.shaderific.com/glsl-functions/
    // https://www.opengl.org/sdk/docs/man4/html/
    // https://msdn.microsoft.com/en-us/library/windows/desktop/ff471376(v=vs.85).aspx
    // http://moutjs.com/docs/v0.11/math.html#map
    // https://code.google.com/p/kuda/source/browse/public/js/hemi/utils/mathUtils.js?r=8d581c02651077c4ac3f5fc4725323210b6b13cc

    // Converts from degrees to radians.
    Maf.deg2Rad = function (degrees) {
        return degrees * Math.PI / 180;
    };

    Maf.toRadians = Maf.deg2Rad;

    // Converts from radians to degrees.
    Maf.rad2Deg = function (radians) {
        return radians * 180 / Math.PI;
    };

    Maf.toDegrees = Maf.rad2Deg;

    Maf.clamp01 = function (v) {
        return Maf.clamp(v, 0, 1);
    };

    // https://www.opengl.org/sdk/docs/man/html/mix.xhtml

    Maf.mix = function (x, y, a) {
        if (a <= 0) return x;
        if (a >= 1) return y;
        return x + a * (y - x);
    };

    Maf.lerp = Maf.mix;

    Maf.inverseMix = function (a, b, v) {
        return (v - a) / (b - a);
    };

    Maf.inverseLerp = Maf.inverseMix;

    Maf.mixUnclamped = function (x, y, a) {
        if (a <= 0) return x;
        if (a >= 1) return y;
        return x + a * (y - x);
    };

    Maf.lerpUnclamped = Maf.mixUnclamped;

    // https://www.opengl.org/sdk/docs/man/html/fract.xhtml

    Maf.fract = function (v) {
        return v - Math.floor(v);
    };

    Maf.frac = Maf.fract;

    // http://stackoverflow.com/questions/4965301/finding-if-a-number-is-a-power-of-2

    Maf.isPowerOfTwo = function (v) {
        return (v - 1 & v) == 0;
    };

    // https://bocoup.com/weblog/find-the-closest-power-of-2-with-javascript

    Maf.closestPowerOfTwo = function (v) {
        return Math.pow(2, Math.round(Math.log(v) / Math.log(2)));
    };

    Maf.nextPowerOfTwo = function (v) {
        return Math.pow(2, Math.ceil(Math.log(v) / Math.log(2)));
    };

    // http://stackoverflow.com/questions/1878907/the-smallest-difference-between-2-angles

    //function mod(a, n) { return a - Math.floor(a/n) * n; }
    Maf.mod = function (a, n) {
        return (a % n + n) % n;
    };

    Maf.deltaAngle = function (a, b) {
        var d = Maf.mod(b - a, 360);
        if (d > 180) d = Math.abs(d - 360);
        return d;
    };

    Maf.deltaAngleDeg = Maf.deltaAngle;

    Maf.deltaAngleRad = function (a, b) {
        return Maf.toRadians(Maf.deltaAngle(Maf.toDegrees(a), Maf.toDegrees(b)));
    };

    Maf.lerpAngle = function (a, b, t) {
        var angle = Maf.deltaAngle(a, b);
        return Maf.mod(a + Maf.lerp(0, angle, t), 360);
    };

    Maf.lerpAngleDeg = Maf.lerpAngle;

    Maf.lerpAngleRad = function (a, b, t) {
        return Maf.toRadians(Maf.lerpAngleDeg(Maf.toDegrees(a), Maf.toDegrees(b), t));
    };

    // http://gamedev.stackexchange.com/questions/74324/gamma-space-and-linear-space-with-shader

    Maf.gammaToLinearSpace = function (v) {
        return Math.pow(v, 2.2);
    };

    Maf.linearToGammaSpace = function (v) {
        return Math.pow(v, 1 / 2.2);
    };

    Maf.map = function (from1, to1, from2, to2, v) {
        return from2 + (v - from1) * (to2 - from2) / (to1 - from1);
    };

    Maf.scale = Maf.map;

    // http://www.iquilezles.org/www/articles/functions/functions.htm

    Maf.almostIdentity = function (x, m, n) {

        if (x > m) return x;

        var a = 2 * n - m;
        var b = 2 * m - 3 * n;
        var t = x / m;

        return (a * t + b) * t * t + n;
    };

    Maf.impulse = function (k, x) {
        var h = k * x;
        return h * Math.exp(1 - h);
    };

    Maf.cubicPulse = function (c, w, x) {
        x = Math.abs(x - c);
        if (x > w) return 0;
        x /= w;
        return 1 - x * x * (3 - 2 * x);
    };

    Maf.expStep = function (x, k, n) {
        return Math.exp(-k * Math.pow(x, n));
    };

    Maf.parabola = function (x, k) {
        return Math.pow(4 * x * (1 - x), k);
    };

    Maf.powerCurve = function (x, a, b) {
        var k = Math.pow(a + b, a + b) / (Math.pow(a, a) * Math.pow(b, b));
        return k * Math.pow(x, a) * Math.pow(1 - x, b);
    };

    // http://iquilezles.org/www/articles/smin/smin.htm ?

    Maf.latLonToCartesian = function (lat, lon) {

        lon += 180;
        lat = Maf.clamp(lat, -85, 85);
        var phi = Maf.toRadians(90 - lat);
        var theta = Maf.toRadians(180 - lon);
        var x = Math.sin(phi) * Math.cos(theta);
        var y = Math.cos(phi);
        var z = Math.sin(phi) * Math.sin(theta);

        return { x: x, y: y, z: z };
    };

    Maf.cartesianToLatLon = function (x, y, z) {
        var n = Math.sqrt(x * x + y * y + z * z);
        return { lat: Math.asin(z / n), lon: Math.atan2(y, x) };
    };

    Maf.randomInRange = function (min, max) {
        return min + Math.random() * (max - min);
    };

    Maf.norm = function (v, minVal, maxVal) {
        return (v - minVal) / (maxVal - minVal);
    };

    Maf.hash = function (n) {
        return Maf.fract((1.0 + Math.cos(n)) * 415.92653);
    };

    Maf.noise2d = function (x, y) {
        var xhash = Maf.hash(x * 37.0);
        var yhash = Maf.hash(y * 57.0);
        return Maf.fract(xhash + yhash);
    };

    // http://iquilezles.org/www/articles/smin/smin.htm

    Maf.smoothMin = function (a, b, k) {
        var res = Math.exp(-k * a) + Math.exp(-k * b);
        return -Math.log(res) / k;
    };

    Maf.smoothMax = function (a, b, k) {
        return Math.log(Math.exp(a) + Math.exp(b)) / k;
    };

    Maf.almost = function (a, b) {
        return Math.abs(a - b) < .0001;
    };

    return Maf;
})();

exports.default = Maf;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9idWRvL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9IYWlycy5qcyIsInNyYy9kZW1vLmpzIiwic3JjL21haW4uanMiLCJ2ZW5kb3IvTWFmLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNWQSxJQUFJLGNBQWMsR0FBRyxFQUFFO0FBQUM7QUFFeEIsU0FBUyxNQUFNLENBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFOztBQUVyQyxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUM7TUFDcEIsUUFBUSxHQUErQixJQUFJLENBQTNDLFFBQVE7TUFBRSxLQUFLLEdBQXdCLElBQUksQ0FBakMsS0FBSztNQUFFLFFBQVEsR0FBYyxJQUFJLENBQTFCLFFBQVE7TUFBRSxRQUFRLEdBQUksSUFBSSxDQUFoQixRQUFRO01BQ25DLE1BQU0sR0FBcUMsUUFBUSxDQUFuRCxNQUFNO01BQUUsVUFBVSxHQUF5QixRQUFRLENBQTNDLFVBQVU7TUFBRSxRQUFRLEdBQWUsUUFBUSxDQUEvQixRQUFRO01BQUUsU0FBUyxHQUFJLFFBQVEsQ0FBckIsU0FBUzs7QUFDOUMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQztBQUM5QixVQUFRLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQzs7QUFFcEIsTUFBSSxRQUFRLEdBQUcsY0FBYyxFQUFFO0FBQzdCLFdBQU87R0FDUjtBQUNELFVBQVEsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDOztNQUVmLENBQUMsR0FBVSxLQUFLLENBQWhCLENBQUM7TUFBRSxDQUFDLEdBQU8sS0FBSyxDQUFiLENBQUM7TUFBRSxDQUFDLEdB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QUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFFLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFFLENBQUM7QUFDOUMsZUFBTyxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUUsR0FBRyxDQUFFLEdBQUMsQ0FBQyxDQUFDO0tBQzlCLENBQUE7O0FBRUQsT0FBRyxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQy9CLGVBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUUsR0FBQyxDQUFDLENBQUM7S0FDbEQsQ0FBQTs7QUFFRCxPQUFHLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRztBQUMxQixlQUFTLElBQUksQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBRSxHQUFHLEtBQUssQ0FBRztLQUN4QyxDQUFBOztBQUVELFdBQU8sR0FBRyxDQUFDO0NBRWQsQ0FBQSxFQUFFLEFBQUMsQ0FBQzs7a0JBRVUsR0FBRyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9tYWluID0gcmVxdWlyZShcIi4vc3JjL21haW5cIik7XG5cbnZhciBfbWFpbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYWluKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gX21haW4yLmRlZmF1bHQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUpwYm1SbGVDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiWFgwPSIsIi8qZ2xvYmFsIFRIUkVFOmZhbHNlKi9cbmltcG9ydCBNYWYgZnJvbSBcIi4uL3ZlbmRvci9NYWZcIjtcblxubGV0IGN1cnZlR2VvbUNhY2hlID0gW107XG5cbmZ1bmN0aW9uIHVwZGF0ZSAoaGFpciwgZHQsIHQsIG9uU3Bhd24pIHtcblxuICBjb25zdCBoYWlyVXBkYXRlVGltZSA9IDAuMTtcbiAgY29uc3Qge3VzZXJEYXRhLCBzY2FsZSwgcG9zaXRpb24sIHJvdGF0aW9ufSA9IGhhaXI7XG4gIGNvbnN0IHtzcHJvdXQsIHNwcm91dFRpbWUsIGxhc3RHcm93LCBncm93U3BlZWR9ID0gdXNlckRhdGE7XG4gIGNvbnN0IGdyb3dUaW1lID0gdCAtIGxhc3RHcm93O1xuICB1c2VyRGF0YS5saWZlICs9IGR0O1xuXG4gIGlmIChncm93VGltZSA8IGhhaXJVcGRhdGVUaW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHVzZXJEYXRhLmxhc3RHcm93ID0gdDtcblxuICBjb25zdCB7eCwgeSwgen0gPSBzY2FsZTtcbiAgaWYgKHVzZXJEYXRhLmxpZmUgPiB1c2VyRGF0YS5mYWxsQWdlICsgNSkge1xuICAgIHVzZXJEYXRhLnJlbW92ZSA9IHRydWU7XG4gIH1cblxuICBpZiAodXNlckRhdGEubGlmZSA+IHVzZXJEYXRhLmZhbGxBZ2UpIHtcbiAgICBwb3NpdGlvbi5zZXQocG9zaXRpb24ueCwgcG9zaXRpb24ueSAtIChNYXRoLnBvdyh1c2VyRGF0YS5saWZlLCA0KSAvIDI1MDAwKSAqIGR0LCBwb3NpdGlvbi56KTtcbiAgICByb3RhdGlvbi5zZXQocm90YXRpb24ueCArIHVzZXJEYXRhLmZhbGxSb3RhdGVTcGVlZCAqIGR0LCByb3RhdGlvbi55LCByb3RhdGlvbi54KTtcbiAgICBzY2FsZS5zZXQoc2NhbGUueCwgTWF0aC5tYXgoMCwgc2NhbGUueSAtIDEwICogZHQpLCBzY2FsZS56KTtcbiAgICAvL2NvbnNvbGUubG9nKHNjYWxlLngudG9GaXhlZCgyKSwgc2NhbGUueS50b0ZpeGVkKDIpKVxuICB9XG5cbiAgLy8gU3RvcCBncm93aW5nXG4gIGlmICh1c2VyRGF0YS5saWZlID4gdXNlckRhdGEuZ3Jvd0FnZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHNjYWxlLnNldCh4LCB5ICsgZ3Jvd1NwZWVkICogZ3Jvd1RpbWUsIHopO1xuICBpZiAoIXNwcm91dCAmJiB1c2VyRGF0YS5saWZlID4gc3Byb3V0VGltZSAmJiB1c2VyRGF0YS5nZW5lcmF0aW9uIDwgNikge1xuICAgIHVzZXJEYXRhLnNwcm91dCA9IHRydWU7XG4gICAgY29uc3QgbmV3UG9zID0ge1xuICAgICAgeDogcG9zaXRpb24ueCArICgwLjUgLSBNYXRoLnJhbmRvbSgpKSAqIDAuMSxcbiAgICAgIHk6IHBvc2l0aW9uLnkgKyAoMC41IC0gTWF0aC5yYW5kb20oKSkgKiAwLjFcbiAgICB9O1xuICAgIG9uU3Bhd24odXNlckRhdGEsIG5ld1Bvcyk7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBtYWtlIChwYXJlbnQsIG1hdGVyaWFscywgdGltZSA9IDApIHtcbiAgY29uc3QgZyA9IG5ldyBUSFJFRS5NZXNoTGluZSgpO1xuICBnLnNldEdlb21ldHJ5KGdldEdlb21ldHJ5KCksIHAgPT4gMSAtIHApO1xuXG4gIGNvbnN0IG1hdGVyaWFsID0gbWF0ZXJpYWxzW01hZi5yYW5kb21JblJhbmdlKDAsIG1hdGVyaWFscy5sZW5ndGgpIHwgMF07XG4gIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnLmdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgY29uc3Qge3VzZXJEYXRhOiBofSA9IG1lc2g7XG4gIGgubGlmZSA9IDA7XG4gIGgubGFzdEdyb3cgPSBwYXJlbnQgPyBwYXJlbnQubGFzdEdyb3cgOiB0aW1lO1xuICBoLmdyb3dTcGVlZCA9IDAuMDU7XG4gIGguc3Byb3V0ID0gZmFsc2U7XG4gIGguZ2VuZXJhdGlvbiA9IHBhcmVudCA/IHBhcmVudC5nZW5lcmF0aW9uICsgMSA6IDE7XG4gIGguc3Byb3V0VGltZSA9IGguZ2VuZXJhdGlvbiArIChNYXRoLnJhbmRvbSgpICogMik7XG4gIGguZmFsbFJvdGF0ZVNwZWVkID0gLSg1IC0gTWF0aC5yYW5kb20oKSAqIDgpICsgMjtcbiAgaC5mYWxsQWdlID0gTWFmLnJhbmRvbUluUmFuZ2UoMTgsIDMwKTtcbiAgaC5ncm93QWdlID0gTWFmLnJhbmRvbUluUmFuZ2UoaC5mYWxsQWdlICogMC41LCBoLmZhbGxBZ2UpO1xuXG4gIHJldHVybiBtZXNoO1xufVxuXG5cbmZ1bmN0aW9uIHBvc2l0aW9uIChtZXNoLCBwb2ludCkge1xuICBtZXNoLnBvc2l0aW9uLnNldChwb2ludC54LCBwb2ludC55LCAtMC4xKTtcbiAgY29uc3QgbGVuZ3RoID0gTWF0aC5yYW5kb20oKSAqIDAuMDE7XG4gIGNvbnN0IHhkZXB0aCA9IGxlbmd0aCAqIDIwO1xuICBjb25zdCB6ZGVwdGggPSBsZW5ndGggKiAyMDtcbiAgbWVzaC5zY2FsZS5zZXQoeGRlcHRoLCBsZW5ndGgsIHpkZXB0aCk7XG59XG5cbmZ1bmN0aW9uIGdldEdlb21ldHJ5ICgpIHtcblxuICBpZiAoY3VydmVHZW9tQ2FjaGUubGVuZ3RoID4gMTAwKSB7XG4gICAgcmV0dXJuIGN1cnZlR2VvbUNhY2hlW01hdGgucmFuZG9tKCkgKiBjdXJ2ZUdlb21DYWNoZS5sZW5ndGggLSAxIHwgMF07XG4gIH1cblxuICBjb25zdCByID0gIE1hZi5yYW5kb21JblJhbmdlO1xuICBjb25zdCBzID0gbmV3IFRIUkVFLkNvbnN0YW50U3BsaW5lKCk7XG4gIHMuaW5jID0gMC4wNTtcbiAgcy5wMCA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApO1xuICBzLnAxID0gcy5wMC5jbG9uZSgpLmFkZChuZXcgVEhSRUUuVmVjdG9yMyhyKC0wLjIsIDAuMiksIDAsIDApKTtcbiAgcy5wMiA9IHMucDEuY2xvbmUoKS5hZGQobmV3IFRIUkVFLlZlY3RvcjMocigtMSwgMSksIC0xLCAwKSk7XG4gIHMucDMgPSBzLnAyLmNsb25lKCkuYWRkKG5ldyBUSFJFRS5WZWN0b3IzKHIoLTEsIDEpLCAwLjEsIHIoMCwgLTEpKSk7XG5cbiAgcy5jYWxjdWxhdGUoKTtcbiAgcy5jYWxjdWxhdGVEaXN0YW5jZXMoKTtcbiAgLy9zLnJldGljdWxhdGUoeyBkaXN0YW5jZVBlclN0ZXA6IC4xIH0pO1xuICBzLnJldGljdWxhdGUoeyBzdGVwczogMTUgfSk7XG4gIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG4gIGZvcihsZXQgaiA9IDA7IGogPCBzLmxQb2ludHMubGVuZ3RoIC0gMTsgaisrKSB7XG4gICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChzLmxQb2ludHNbIGogXS5jbG9uZSgpKTtcbiAgfVxuXG4gIGN1cnZlR2VvbUNhY2hlLnB1c2goZ2VvbWV0cnkpO1xuICByZXR1cm4gZ2VvbWV0cnk7XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHVwZGF0ZSxcbiAgbWFrZSxcbiAgcG9zaXRpb25cbn07XG4iLCJleHBvcnQgZGVmYXVsdCBbXG4gIHtcbiAgICBcInRpbWVcIjogMi4yNDcwMTk5OTk5OTk5OTg3LFxuICAgIFwieFwiOiAxLjEyOTY1NTQyMzAyNTYyODQsXG4gICAgXCJ5XCI6IDAuMDM1NjczMzI3Njc1MDM2NjE1XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogMi4yOTM0Mzk5OTk5OTk5OTksXG4gICAgXCJ4XCI6IDEuMTI5NjU1NDIzMDI1NjI4NCxcbiAgICBcInlcIjogMC4wMzU2NzMzMjc2NzUwMzY2MTVcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiAyLjM2NTMyNSxcbiAgICBcInhcIjogMS4xMjk2NTU0MjMwMjU2Mjg0LFxuICAgIFwieVwiOiAwLjAzMDkxNjg4Mzk4NTAzMTU2MlxuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDIuNDA1MDk1LFxuICAgIFwieFwiOiAxLjEyOTY1NTQyMzAyNTYyODQsXG4gICAgXCJ5XCI6IDAuMDI2MTYwNDQwMjk1MDI2ODQzXG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogMi40Mzc5MyxcbiAgICBcInhcIjogMS4xMjk2NTU0MjMwMjU2Mjg0LFxuICAgIFwieVwiOiAwLjAyMTQwMzk5NjYwNTAyMTkwMlxuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDIuNDU1MDU1LFxuICAgIFwieFwiOiAxLjEyNDg5ODk3OTEzOTIwNDgsXG4gICAgXCJ5XCI6IDAuMDIxNDAzOTk2NjA1MDIyMDEzXG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogMi40NzQwNTUwMDAwMDAwMDAzLFxuICAgIFwieFwiOiAxLjEyNDg5ODk3OTEzOTIwNTIsXG4gICAgXCJ5XCI6IDAuMDE2NjQ3NTUyOTE1MDE2NzRcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiAyLjQ5MTg1NSxcbiAgICBcInhcIjogMS4xMjAxNDI1MzUyNTI3ODEyLFxuICAgIFwieVwiOiAwLjAxNjY0NzU1MjkxNTAxNjk2XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogMi41MDgwNDUwMDAwMDAwMDA1LFxuICAgIFwieFwiOiAxLjExNTM4NjA5MTM2NjM1NzYsXG4gICAgXCJ5XCI6IDAuMDExODkxMTA5MjI1MDEyMDJcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiAyLjUyNDE0MDAwMDAwMDAwMSxcbiAgICBcInhcIjogMS4xMTUzODYwOTEzNjYzNTc2LFxuICAgIFwieVwiOiAwLjAwNzEzNDY2NTUzNTAwNzA3OVxuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDIuNTQyOTgwMDAwMDAwMDAwNSxcbiAgICBcInhcIjogMS4xMTA2Mjk2NDc0Nzk5MzM1LFxuICAgIFwieVwiOiAwLjAwMjM3ODIyMTg0NTAwMjU4MTZcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiAyLjU1NzUzMDAwMDAwMDAwMDMsXG4gICAgXCJ4XCI6IDEuMTA1ODczMjAzNTkzNTEsXG4gICAgXCJ5XCI6IDAuMDAyMzc4MjIxODQ1MDAyMjQ4NVxuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDIuNTc1MjQ1MDAwMDAwMDAwNyxcbiAgICBcInhcIjogMS4xMDExMTY3NTk3MDcwODYzLFxuICAgIFwieVwiOiAwLjAwMjM3ODIyMTg0NTAwMjM1OTZcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiAyLjYwMDI2MDAwMDAwMDAwMDUsXG4gICAgXCJ4XCI6IDEuMTAxMTE2NzU5NzA3MDg2MyxcbiAgICBcInlcIjogMC4wMDIzNzgyMjE4NDUwMDIzNTk2XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogMi42MTcxNDUwMDAwMDAwMDAzLFxuICAgIFwieFwiOiAxLjEwMTExNjc1OTcwNzA4NjMsXG4gICAgXCJ5XCI6IC0wLjAwMjM3ODIyMTg0NTAwMjU4MTZcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiAyLjYzMzg5NTAwMDAwMDAwMDMsXG4gICAgXCJ4XCI6IDEuMDk2MzYwMzE1ODIwNjYyMyxcbiAgICBcInlcIjogLTAuMDAyMzc4MjIxODQ1MDAyNjkyNlxuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDIuNjUwNjg1MDAwMDAwMDAxLFxuICAgIFwieFwiOiAxLjA5MTYwMzg3MTkzNDIzOTEsXG4gICAgXCJ5XCI6IC0wLjAwMjM3ODIyMTg0NTAwMjY5MjZcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiAyLjY3ODAxMDAwMDAwMDAwMSxcbiAgICBcInhcIjogMS4wODY4NDc0MjgwNDc4MTQ2LFxuICAgIFwieVwiOiAtMC4wMDIzNzgyMjE4NDUwMDI1ODE2XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogMi43MTcwMjAwMDAwMDAwMDEsXG4gICAgXCJ4XCI6IDEuMDgyMDkwOTg0MTYxMzkxNSxcbiAgICBcInlcIjogLTAuMDAyMzc4MjIxODQ1MDAyNTgxNlxuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDIuNzM4NzA1MDAwMDAwMDAxNyxcbiAgICBcInhcIjogMS4wODIwOTA5ODQxNjEzOTE1LFxuICAgIFwieVwiOiAtMC4wMDcxMzQ2NjU1MzUwMDc0MTJcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiAyLjc1ODEzNTAwMDAwMDAwMTYsXG4gICAgXCJ4XCI6IDEuMDc3MzM0NTQwMjc0OTY3OSxcbiAgICBcInlcIjogLTAuMDA3MTM0NjY1NTM1MDA3MzAxXG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogMi43ODI3NzAwMDAwMDAwMDEsXG4gICAgXCJ4XCI6IDEuMDc3MzM0NTQwMjc0OTY3OSxcbiAgICBcInlcIjogLTAuMDExODkxMTA5MjI1MDEyMTNcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiAyLjgxMTExMDAwMDAwMDAwMSxcbiAgICBcInhcIjogMS4wNzI1NzgwOTYzODg1NDQzLFxuICAgIFwieVwiOiAtMC4wMTE4OTExMDkyMjUwMTIxM1xuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDIuODcwNDAwMDAwMDAwMDAyLFxuICAgIFwieFwiOiAxLjA3MjU3ODA5NjM4ODU0NDMsXG4gICAgXCJ5XCI6IC0wLjAxMTg5MTEwOTIyNTAxMjEzXG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogMy44MDg3OTAwMDAwMDAwMDg2LFxuICAgIFwieFwiOiAwLjYxNTk1OTQ4MzI5MTg2OTEsXG4gICAgXCJ5XCI6IDAuMDQwNDI5NzcxMzY1MDQxNDQ1XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogMy44MzM1NzAwMDAwMDAwMDksXG4gICAgXCJ4XCI6IDAuNjE1OTU5NDgzMjkxODY5MSxcbiAgICBcInlcIjogMC4wNDA0Mjk3NzEzNjUwNDE0NDVcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiAzLjg1ODIzMDAwMDAwMDAwODcsXG4gICAgXCJ4XCI6IDAuNjExMjAzMDM5NDA1NDQ1MixcbiAgICBcInlcIjogMC4wNDA0Mjk3NzEzNjUwNDE1NTZcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiAzLjg3NTgyMDAwMDAwMDAwOSxcbiAgICBcInhcIjogMC42MTEyMDMwMzk0MDU0NDUyLFxuICAgIFwieVwiOiAwLjA0NTE4NjIxNTA1NTA0NjM4NlxuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDMuOTA2ODk1MDAwMDAwMDA5LFxuICAgIFwieFwiOiAwLjYwNjQ0NjU5NTUxOTAyMTYsXG4gICAgXCJ5XCI6IDAuMDQ1MTg2MjE1MDU1MDQ2Mjc1XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogMy45MzM2MTUwMDAwMDAwMDksXG4gICAgXCJ4XCI6IDAuNjA2NDQ2NTk1NTE5MDIxNyxcbiAgICBcInlcIjogMC4wNDk5NDI2NTg3NDUwNTExMDVcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiAzLjk1MjMxNTAwMDAwMDAwOSxcbiAgICBcInhcIjogMC42MDE2OTAxNTE2MzI1OTgxLFxuICAgIFwieVwiOiAwLjA0OTk0MjY1ODc0NTA1MTMzXG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogMy45NzQ4MjUwMDAwMDAwMDk0LFxuICAgIFwieFwiOiAwLjYwMTY5MDE1MTYzMjU5ODEsXG4gICAgXCJ5XCI6IDAuMDQ5OTQyNjU4NzQ1MDUxMzNcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiA0LjAyMDQ2NTAwMDAwMDAwOTUsXG4gICAgXCJ4XCI6IDAuNTk2OTMzNzA3NzQ2MTc0MixcbiAgICBcInlcIjogMC4wNDk5NDI2NTg3NDUwNTExMDVcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiA0LjA1ODk4MDAwMDAwMDAwOCxcbiAgICBcInhcIjogMC41OTIxNzcyNjM4NTk3NTA0LFxuICAgIFwieVwiOiAwLjA0OTk0MjY1ODc0NTA1MTIxNlxuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDQuMTAxMTQwMDAwMDAwMDA3LFxuICAgIFwieFwiOiAwLjU4NzQyMDgxOTk3MzMyNjYsXG4gICAgXCJ5XCI6IDAuMDQ5OTQyNjU4NzQ1MDUxMjE2XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogNC4xNTYzNTAwMDAwMDAwMDcsXG4gICAgXCJ4XCI6IDAuNTgyNjY0Mzc2MDg2OTAzMixcbiAgICBcInlcIjogMC4wNDk5NDI2NTg3NDUwNTA5OTRcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiA0LjMzODUzNTAwMDAwMDAwNyxcbiAgICBcInhcIjogMC41ODc0MjA4MTk5NzMzMjY2LFxuICAgIFwieVwiOiAwLjA0OTk0MjY1ODc0NTA1MTIxNlxuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDQuMzYxMjYwMDAwMDAwMDA3LFxuICAgIFwieFwiOiAwLjU5NjkzMzcwNzc0NjE3NDIsXG4gICAgXCJ5XCI6IDAuMDQ1MTg2MjE1MDU1MDQ2Mjc1XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogNC4zNzQyMzAwMDAwMDAwMDUsXG4gICAgXCJ4XCI6IDAuNTk2OTMzNzA3NzQ2MTc0NCxcbiAgICBcInlcIjogMC4wNDA0Mjk3NzEzNjUwNDE1NTZcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiA0LjM5MTY3NTAwMDAwMDAwNixcbiAgICBcInhcIjogMC42MDE2OTAxNTE2MzI1OTgsXG4gICAgXCJ5XCI6IDAuMDQwNDI5NzcxMzY1MDQxNTU2XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogNC40MDY5OTAwMDAwMDAwMDYsXG4gICAgXCJ4XCI6IDAuNjA2NDQ2NTk1NTE5MDIxNyxcbiAgICBcInlcIjogMC4wMzU2NzMzMjc2NzUwMzY1MDRcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiA0LjQyNDkyMDAwMDAwMDAwNTUsXG4gICAgXCJ4XCI6IDAuNjA2NDQ2NTk1NTE5MDIxNixcbiAgICBcInlcIjogMC4wMzA5MTY4ODM5ODUwMzE2NzNcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiA0LjQ0MTk5NTAwMDAwMDAwNixcbiAgICBcInhcIjogMC42MTEyMDMwMzk0MDU0NDUyLFxuICAgIFwieVwiOiAwLjAyNjE2MDQ0MDI5NTAyNjYyXG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogNC40NTk4MDAwMDAwMDAwMDYsXG4gICAgXCJ4XCI6IDAuNjExMjAzMDM5NDA1NDQ1MixcbiAgICBcInlcIjogMC4wMjYxNjA0NDAyOTUwMjY2MlxuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDQuNDk0MDQ1MDAwMDAwMDA1LFxuICAgIFwieFwiOiAwLjYxNTk1OTQ4MzI5MTg2OTEsXG4gICAgXCJ5XCI6IDAuMDIxNDAzOTk2NjA1MDIxOTAyXG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogNC41MjU3NzAwMDAwMDAwMDUsXG4gICAgXCJ4XCI6IDAuNjIwNzE1OTI3MTc4MjkyOCxcbiAgICBcInlcIjogMC4wMjE0MDM5OTY2MDUwMjE5MDJcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiA0LjUzNDI1MDAwMDAwMDAwNSxcbiAgICBcInhcIjogMC42MjU0NzIzNzEwNjQ3MTYyLFxuICAgIFwieVwiOiAwLjAxNjY0NzU1MjkxNTAxNjg1XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogNC41NTgxMzUwMDAwMDAwMDUsXG4gICAgXCJ4XCI6IDAuNjI1NDcyMzcxMDY0NzE2MyxcbiAgICBcInlcIjogMC4wMTE4OTExMDkyMjUwMTIwMlxuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDQuNTY4NTc1MDAwMDAwMDA0NSxcbiAgICBcInhcIjogMC42MzAyMjg4MTQ5NTExNDAxLFxuICAgIFwieVwiOiAwLjAxMTg5MTEwOTIyNTAxMjAyXG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogNC41ODUzNTAwMDAwMDAwMDQsXG4gICAgXCJ4XCI6IDAuNjM0OTg1MjU4ODM3NTY0MSxcbiAgICBcInlcIjogMC4wMDIzNzgyMjE4NDUwMDIzNTk2XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogNC42MDYzOTUwMDAwMDAwMDMsXG4gICAgXCJ4XCI6IDAuNjM5NzQxNzAyNzIzOTg3NyxcbiAgICBcInlcIjogMC4wMDIzNzgyMjE4NDUwMDI1ODE2XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogNC42Mzc1MjUwMDAwMDAwMDMsXG4gICAgXCJ4XCI6IDAuNjQ0NDk4MTQ2NjEwNDExMixcbiAgICBcInlcIjogMC4wMDIzNzgyMjE4NDUwMDI1ODE2XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogNC42NjE2MDUwMDAwMDAwMDE2LFxuICAgIFwieFwiOiAwLjY0NDQ5ODE0NjYxMDQxMTIsXG4gICAgXCJ5XCI6IDAuMDAyMzc4MjIxODQ1MDAyNTgxNlxuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDQuNjc4NDU1MDAwMDAwMDAxLFxuICAgIFwieFwiOiAwLjY0NDQ5ODE0NjYxMDQxMTIsXG4gICAgXCJ5XCI6IC0wLjAwMjM3ODIyMTg0NTAwMjY5MjZcbiAgfSxcbiAge1xuICAgIFwidGltZVwiOiA0LjY5NTc5MDAwMDAwMDAwMTUsXG4gICAgXCJ4XCI6IDAuNjQ5MjU0NTkwNDk2ODM0OSxcbiAgICBcInlcIjogLTAuMDAyMzc4MjIxODQ1MDAyNDcwNlxuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDQuNzEzMzUwMDAwMDAwMDAxLFxuICAgIFwieFwiOiAwLjY1NDAxMTAzNDM4MzI1ODYsXG4gICAgXCJ5XCI6IC0wLjAwNzEzNDY2NTUzNTAwNzMwMVxuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDQuNzMwMTM1MDAwMDAwMDAxLFxuICAgIFwieFwiOiAwLjY1NDAxMTAzNDM4MzI1ODUsXG4gICAgXCJ5XCI6IC0wLjAxMTg5MTEwOTIyNTAxMjM1M1xuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDQuNzU1OTg1LFxuICAgIFwieFwiOiAwLjY1ODc2NzQ3ODI2OTY4MjUsXG4gICAgXCJ5XCI6IC0wLjAxMTg5MTEwOTIyNTAxMjM1M1xuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDQuNzY4OTc0OTk5OTk5OTk5LFxuICAgIFwieFwiOiAwLjY1ODc2NzQ3ODI2OTY4MjUsXG4gICAgXCJ5XCI6IC0wLjAxNjY0NzU1MjkxNTAxNzI5NFxuICB9LFxuICB7XG4gICAgXCJ0aW1lXCI6IDQuODA0NTI5OTk5OTk5OTk5LFxuICAgIFwieFwiOiAwLjY1ODc2NzQ3ODI2OTY4MjYsXG4gICAgXCJ5XCI6IC0wLjAyMTQwMzk5NjYwNTAyMTc5XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogNC44NjI5NTk5OTk5OTk5OTgsXG4gICAgXCJ4XCI6IDAuNjU4NzY3NDc4MjY5NjgyMyxcbiAgICBcInlcIjogLTAuMDI2MTYwNDQwMjk1MDI2OTU0XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogNC44OTQwMzk5OTk5OTk5OTksXG4gICAgXCJ4XCI6IDAuNjU4NzY3NDc4MjY5NjgyMyxcbiAgICBcInlcIjogLTAuMDI2MTYwNDQwMjk1MDI2OTU0XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogNC45MjY0MzQ5OTk5OTk5OTcsXG4gICAgXCJ4XCI6IDAuNjU4NzY3NDc4MjY5NjgyNCxcbiAgICBcInlcIjogLTAuMDMwOTE2ODgzOTg1MDMxODk1XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogNC45NTgxOTQ5OTk5OTk5OTcsXG4gICAgXCJ4XCI6IDAuNjU4NzY3NDc4MjY5NjgyNSxcbiAgICBcInlcIjogLTAuMDM1NjczMzI3Njc1MDM2NzI2XG4gIH0sXG4gIHtcbiAgICBcInRpbWVcIjogNC45NzUzMDk5OTk5OTk5OTcsXG4gICAgXCJ4XCI6IDAuNjYzNTIzOTIyMTU2MTA1NyxcbiAgICBcInlcIjogLTAuMDM1NjczMzI3Njc1MDM2NzI2XG4gIH1cbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qZ2xvYmFsIFRIUkVFOmZhbHNlKi9cbmltcG9ydCBIYWlycyBmcm9tIFwiLi9IYWlyc1wiO1xuaW1wb3J0IGRlbW8gZnJvbSBcIi4vZGVtb1wiO1xuXG5sZXQgbm9zZUhhaXJzID0gZGVtby5zbGljZSgwKTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgYmluZEV2ZW50cygpO1xuICBvbldpbmRvd1Jlc2l6ZSgpO1xuICB0aWNrKCk7XG59KTtcblxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXJcIik7XG5cbmNvbnN0IHdvcmxkID0gKCgpID0+IHtcbiAgY29uc3Qgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgY29uc3QgcmVzb2x1dGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IyKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBjb25zdCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNjAsIHJlc29sdXRpb24ueCAvIHJlc29sdXRpb24ueSwgLjEsIDEwMCk7XG4gIGNhbWVyYS5wb3NpdGlvbi5zZXQoMCwgMCwgLTEwKTtcblxuICBjb25zdCByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlLCBhbHBoYTogdHJ1ZSB9KTtcbiAgcmVuZGVyZXIuc2V0U2l6ZShyZXNvbHV0aW9uLngsIHJlc29sdXRpb24ueSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgY29uc3QgY29udHJvbHMgPSBuZXcgVEhSRUUuT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICBjb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuICBjb25zdCByYXljYXN0ZXIgPSBuZXcgVEhSRUUuUmF5Y2FzdGVyKCk7XG5cbiAgcmV0dXJuIHtcbiAgICBzY2VuZSxcbiAgICByZXNvbHV0aW9uLFxuICAgIGNhbWVyYSxcbiAgICByZW5kZXJlcixcbiAgICBjbG9jayxcbiAgICBjb250cm9scyxcbiAgICByYXljYXN0ZXJcbiAgfTtcbn0pKCk7XG5cblxuY29uc3QgQ09NTUFORFMgPSB7XG4gIFwibm9uZVwiOiBcIlwiLFxuICBcImRyYXdcIjogXCJkcmF3XCIsXG4gIFwiZXJhc2VcIjogXCJlcmFzZVwiXG59O1xuXG5jb25zdCBnYW1lID0ge1xuICBkdWRlOiBhZGRPYmplY3RUb1NjZW5lKG1ha2VEdWRlKCkpLFxuICBnbGFzc2VzOiBhZGRPYmplY3RUb1NjZW5lKG1ha2VHbGFzc2VzKCkpLFxuICBoYWlyczogW10sXG4gIGNvbW1hbmQ6IENPTU1BTkRTLm5vbmUsXG4gIG1vdXNlOiBuZXcgVEhSRUUuVmVjdG9yMigwLCAwKSxcbiAgd29ybGRcbn07XG5cbmdhbWUuZHVkZS5wb3NpdGlvbi5zZXQoMC4zLCAwLjU2LCAtMC4wOSk7XG5nYW1lLmdsYXNzZXMucG9zaXRpb24uc2V0KDAuNzUgLCAxLjA1LCAtNS4yKTtcblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gIGNvbnN0IHtjbGllbnRXaWR0aDp3LCBjbGllbnRIZWlnaHQ6aH0gPSBjb250YWluZXI7XG4gIGNvbnN0IHtjYW1lcmEsIHJlbmRlcmVyLCByZXNvbHV0aW9ufSA9IHdvcmxkO1xuICBjYW1lcmEuYXNwZWN0ID0gdyAvIGg7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgcmVuZGVyZXIuc2V0U2l6ZSh3LCBoKTtcbiAgcmVzb2x1dGlvbi5zZXQodywgaCk7XG59XG5cbmZ1bmN0aW9uIGJpbmRFdmVudHMgKCkge1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlID0+IHtcbiAgICBpZiAoZS5zaGlmdEtleSkgeyBnYW1lLmNvbW1hbmQgPSBDT01NQU5EUy5kcmF3OyB9XG4gICAgaWYgKGUubWV0YUtleSkgeyBnYW1lLmNvbW1hbmQgPSBDT01NQU5EUy5lcmFzZTsgfVxuICB9KTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBlID0+IHtcbiAgICBjb25zdCB7Y29tbWFuZH0gPSBnYW1lO1xuICAgIGlmIChjb21tYW5kID09IENPTU1BTkRTLmRyYXcgJiYgIWUuc2hpZnRLZXkpIGdhbWUuY29tbWFuZCA9IENPTU1BTkRTLm5vbmU7XG4gICAgaWYgKGNvbW1hbmQgPT0gQ09NTUFORFMuZXJhc2UgJiYgIWUubWV0YUtleSkgZ2FtZS5jb21tYW5kID0gQ09NTUFORFMubm9uZTtcbiAgfSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGUgPT4ge1xuICAgIGNvbnN0IHtyZW5kZXJlcn0gPSB3b3JsZDtcbiAgICBjb25zdCB7bW91c2UsIGNvbW1hbmR9ID0gZ2FtZTtcbiAgICBtb3VzZS54ID0gKGUuY2xpZW50WCAvIChyZW5kZXJlci5kb21FbGVtZW50LndpZHRoIC8gd2luZG93LmRldmljZVBpeGVsUmF0aW8pKSAqIDIgLSAxO1xuICAgIG1vdXNlLnkgPSAtIChlLmNsaWVudFkgLyAocmVuZGVyZXIuZG9tRWxlbWVudC5oZWlnaHQgLyB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbykpICogMiArIDE7XG5cbiAgICBpZiAoY29tbWFuZCAhPT0gQ09NTUFORFMubm9uZSkge1xuICAgICAgaGFuZGxlSGFpckNvbW1hbmQoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5jb25zdCBoYWlyTWF0ZXJpYWxzID0gKCgpID0+IHtcbiAgY29uc3Qge3Jlc29sdXRpb24sIGNhbWVyYX0gPSB3b3JsZDtcbiAgY29uc3QgaGFpckNvbG9ycyA9IFtcbiAgICAweDQ0MzU0MiwgMHg1MzNENDYsIDB4MkYyNDMyLFxuICAgIDB4M0MyRTNCLCAweDVENDk1MSwgMHg4QzVENURcbiAgXTtcbiAgcmV0dXJuIGhhaXJDb2xvcnMubWFwKGMgPT4gbmV3IFRIUkVFLk1lc2hMaW5lTWF0ZXJpYWwoe1xuICAgIGNvbG9yOiBuZXcgVEhSRUUuQ29sb3IoYyksXG4gICAgb3BhY2l0eTogMSxcbiAgICByZXNvbHV0aW9uOiByZXNvbHV0aW9uLFxuICAgIGxpbmVXaWR0aDogNixcbiAgICBuZWFyOiBjYW1lcmEubmVhcixcbiAgICBmYXI6IGNhbWVyYS5mYXIsXG4gICAgZGVwdGhUZXN0OiB0cnVlLFxuICAgIGJsZW5kaW5nOiBUSFJFRS5Ob3JtYWxCbGVuZGluZyxcbiAgICBzaXplQXR0ZW51YXRpb246IGZhbHNlLFxuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGVcbiAgfSkpO1xufSkoKTtcblxuZnVuY3Rpb24gYWRkT2JqZWN0VG9TY2VuZSAob2JqKSB7XG4gIHdvcmxkLnNjZW5lLmFkZChvYmopO1xuICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiBhZGRIYWlyVG9Xb3JsZCAoaGFpcikge1xuICBnYW1lLmhhaXJzLnB1c2goYWRkT2JqZWN0VG9TY2VuZShoYWlyKSk7XG4gIHJldHVybiBoYWlyO1xufVxuXG5mdW5jdGlvbiBtYWtlRHVkZSAoKSB7XG4gIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoNywgNywgMTYpO1xuICBjb25zdCBsb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuICBsb2FkZXIuY3Jvc3NPcmlnaW4gPSBcIlwiO1xuICBjb25zdCB0ZXh0dXJlID0gbG9hZGVyLmxvYWQoXCIuL2Fzc2V0cy9tYW4ucG5nXCIpO1xuICAvL2NvbnN0IHRleHR1cmUgPSBsb2FkZXIubG9hZChcImh0dHA6Ly9pLmltZ3VyLmNvbS8weVBaeFNQLmpwZ1wiKTtcbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe3NpZGU6IFRIUkVFLkRvdWJsZVNpZGUsIG1hcDp0ZXh0dXJlLCB0cmFuc3BhcmVudDp0cnVlfSk7XG4gIGNvbnN0IHBsYW5lID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgcmV0dXJuIHBsYW5lO1xufVxuXG5mdW5jdGlvbiBtYWtlR2xhc3NlcyAoKSB7XG4gIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMy41LCAzLjUsIDE2KTtcbiAgY29uc3QgbG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcbiAgY29uc3QgdGV4dHVyZSA9IGxvYWRlci5sb2FkKFwiLi9hc3NldHMvZ2xhc3Nlcy5wbmdcIik7XG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHttYXA6dGV4dHVyZSwgdHJhbnNwYXJlbnQ6dHJ1ZX0pO1xuICBjb25zdCBwbGFuZSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gIHJldHVybiBwbGFuZTtcbn1cblxuZnVuY3Rpb24gc3Bhd25IYWlyIChwYXJlbnRVc2VyRGF0YSwgcG9zaXRpb24pIHtcbiAgY29uc3Qge2Nsb2NrfSA9IHdvcmxkO1xuICBjb25zdCBtZXNoID0gSGFpcnMubWFrZShwYXJlbnRVc2VyRGF0YSwgaGFpck1hdGVyaWFscywgY2xvY2suZ2V0RWxhcHNlZFRpbWUoKSk7XG4gIEhhaXJzLnBvc2l0aW9uKG1lc2gsIHBvc2l0aW9uKTtcbiAgcmV0dXJuIGFkZEhhaXJUb1dvcmxkKG1lc2gpO1xufVxuXG53aW5kb3cucG9vcCA9IFtdO1xuZnVuY3Rpb24gaGFuZGxlSGFpckNvbW1hbmQgKCkge1xuICBjb25zdCB7Y2FtZXJhLCByYXljYXN0ZXJ9ID0gd29ybGQ7XG4gIGNvbnN0IHtkdWRlLCBtb3VzZX0gPSBnYW1lO1xuICByYXljYXN0ZXIuc2V0RnJvbUNhbWVyYShtb3VzZSwgY2FtZXJhKTtcblxuICBzd2l0Y2ggKGdhbWUuY29tbWFuZCkge1xuXG4gIGNhc2UgQ09NTUFORFMuZHJhdzpcbiAgICBjb25zdCBpbnRlcnNlY3RzID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHMoW2R1ZGVdLCBmYWxzZSk7XG4gICAgaWYgKGludGVyc2VjdHMubGVuZ3RoID4gMCkge1xuICAgICAgd2luZG93LnBvb3AucHVzaCh7XG4gICAgICAgIHRpbWU6IHdvcmxkLmNsb2NrLmdldEVsYXBzZWRUaW1lKCksXG4gICAgICAgIHg6IGludGVyc2VjdHNbMF0ucG9pbnQueCxcbiAgICAgICAgeTogaW50ZXJzZWN0c1swXS5wb2ludC55XG4gICAgICB9KTtcbiAgICAgIHNwYXduSGFpcihudWxsLCBpbnRlcnNlY3RzWzBdLnBvaW50KTtcbiAgICB9XG4gICAgYnJlYWs7XG5cbiAgY2FzZSBDT01NQU5EUy5lcmFzZTpcbiAgICBicmVhaztcbiAgfVxufVxuXG5mdW5jdGlvbiB0aWNrICgpIHtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuXG4gIGNvbnN0IHtjbG9jaywgc2NlbmUsIHJlbmRlcmVyLCBjb250cm9scywgY2FtZXJhfSA9IHdvcmxkO1xuICBjb25zdCBkdCA9IGNsb2NrLmdldERlbHRhKCk7XG4gIGNvbnN0IHQgPSBjbG9jay5nZXRFbGFwc2VkVGltZSgpO1xuXG4gIGlmIChub3NlSGFpcnMubGVuZ3RoKSB7XG4gICAgaWYgKG5vc2VIYWlyc1swXS50aW1lIDwgdCkge1xuICAgICAgc3Bhd25IYWlyKG51bGwsIG5vc2VIYWlyc1swXSk7XG4gICAgICBub3NlSGFpcnMgPSBub3NlSGFpcnMuc2xpY2UoMSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qge2hhaXJzfSA9IGdhbWU7XG4gIGNvbnRyb2xzLnVwZGF0ZSgpO1xuXG4gIGxldCBkb1JlbW92ZSA9IGZhbHNlO1xuICBoYWlycy5mb3JFYWNoKChoYWlyKSA9PiB7XG4gICAgSGFpcnMudXBkYXRlKGhhaXIsIGR0LCB0LCBzcGF3bkhhaXIpO1xuICAgIGlmIChoYWlyLnVzZXJEYXRhLnJlbW92ZSkge1xuICAgICAgZG9SZW1vdmUgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGRvUmVtb3ZlKSB7XG4gICAgZ2FtZS5oYWlycyA9IGhhaXJzLmZpbHRlcihoYWlyID0+IHtcbiAgICAgIGlmIChoYWlyLnVzZXJEYXRhLnJlbW92ZSkge1xuICAgICAgICBzY2VuZS5yZW1vdmUoaGFpcik7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbn1cbiIsImNvbnN0IE1hZiA9IChmdW5jdGlvbigpIHtcblxuICAgIC8vIE1vZHVsZSBjb2RlIGZyb20gdW5kZXJzY29yZS5qc1xuXG4gICAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgKGBzZWxmYCkgaW4gdGhlIGJyb3dzZXIsIGBnbG9iYWxgXG4gICAgLy8gb24gdGhlIHNlcnZlciwgb3IgYHRoaXNgIGluIHNvbWUgdmlydHVhbCBtYWNoaW5lcy4gV2UgdXNlIGBzZWxmYFxuICAgIC8vIGluc3RlYWQgb2YgYHdpbmRvd2AgZm9yIGBXZWJXb3JrZXJgIHN1cHBvcnQuXG4gICAgdmFyIHJvb3QgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmLnNlbGYgPT09IHNlbGYgJiYgc2VsZiB8fFxuICAgICAgICAgICAgdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwuZ2xvYmFsID09PSBnbG9iYWwgJiYgZ2xvYmFsIHx8XG4gICAgICAgICAgICB0aGlzO1xuXG4gICAgdmFyIE1hZiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgTWFmICkgcmV0dXJuIG9iajtcbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE1hZiApKSByZXR1cm4gbmV3IE1hZihvYmopO1xuICAgICAgICB0aGlzLl93cmFwcGVkID0gb2JqO1xuICAgIH07XG5cbiAgICAvLyBFeHBvcnQgdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciAqKk5vZGUuanMqKiwgd2l0aFxuICAgIC8vIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IGZvciB0aGVpciBvbGQgbW9kdWxlIEFQSS4gSWYgd2UncmUgaW5cbiAgICAvLyB0aGUgYnJvd3NlciwgYWRkIGBNYWZgIGFzIGEgZ2xvYmFsIG9iamVjdC5cbiAgICAvLyAoYG5vZGVUeXBlYCBpcyBjaGVja2VkIHRvIGVuc3VyZSB0aGF0IGBtb2R1bGVgXG4gICAgLy8gYW5kIGBleHBvcnRzYCBhcmUgbm90IEhUTUwgZWxlbWVudHMuKVxuICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPSAndW5kZWZpbmVkJyAmJiAhZXhwb3J0cy5ub2RlVHlwZSkge1xuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IE1hZjtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRzLk1hZiA9IE1hZjtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290Lk1hZiA9IE1hZjtcbiAgICB9XG5cbiAgICAvLyBDdXJyZW50IHZlcnNpb24uXG4gICAgTWFmLlZFUlNJT04gPSAnMS4wLjAnO1xuXG4gICAgTWFmLlBJID0gTWF0aC5QSTtcblxuICAgIC8vIGh0dHBzOi8vd3d3Lm9wZW5nbC5vcmcvc2RrL2RvY3MvbWFuL2h0bWwvY2xhbXAueGh0bWxcblxuICAgIE1hZi5jbGFtcCA9IGZ1bmN0aW9uKCB2LCBtaW5WYWwsIG1heFZhbCApIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKCBtYXhWYWwsIE1hdGgubWF4KCBtaW5WYWwsIHYgKSApO1xuICAgIH07XG5cbiAgICAvLyBodHRwczovL3d3dy5vcGVuZ2wub3JnL3Nkay9kb2NzL21hbi9odG1sL3N0ZXAueGh0bWxcblxuICAgIE1hZi5zdGVwID0gZnVuY3Rpb24oIGVkZ2UsIHYgKSB7XG4gICAgICAgIHJldHVybiAoIHYgPCBlZGdlICkgPyAwIDogMTtcbiAgICB9XG5cbiAgICAvLyBodHRwczovL3d3dy5vcGVuZ2wub3JnL3Nkay9kb2NzL21hbi9odG1sL3Ntb290aHN0ZXAueGh0bWxcblxuICAgIE1hZi5zbW9vdGhTdGVwID0gZnVuY3Rpb24gKCBlZGdlMCwgZWRnZTEsIHYgKSB7XG4gICAgICAgIHZhciB0ID0gTWFmLmNsYW1wKCAoIHYgLSBlZGdlMCApIC8gKCBlZGdlMSAtIGVkZ2UwICksIDAuMCwgMS4wICk7XG4gICAgICAgIHJldHVybiB0ICogdCAqICggMy4wIC0gMi4wICogdCApO1xuICAgIH07XG5cbiAgICAvLyBodHRwOi8vZG9jcy51bml0eTNkLmNvbS9TY3JpcHRSZWZlcmVuY2UvTWF0aGYuaHRtbFxuICAgIC8vIGh0dHA6Ly93d3cuc2hhZGVyaWZpYy5jb20vZ2xzbC1mdW5jdGlvbnMvXG4gICAgLy8gaHR0cHM6Ly93d3cub3BlbmdsLm9yZy9zZGsvZG9jcy9tYW40L2h0bWwvXG4gICAgLy8gaHR0cHM6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS93aW5kb3dzL2Rlc2t0b3AvZmY0NzEzNzYodj12cy44NSkuYXNweFxuICAgIC8vIGh0dHA6Ly9tb3V0anMuY29tL2RvY3MvdjAuMTEvbWF0aC5odG1sI21hcFxuICAgIC8vIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3Ava3VkYS9zb3VyY2UvYnJvd3NlL3B1YmxpYy9qcy9oZW1pL3V0aWxzL21hdGhVdGlscy5qcz9yPThkNTgxYzAyNjUxMDc3YzRhYzNmNWZjNDcyNTMyMzIxMGI2YjEzY2NcblxuICAgIC8vIENvbnZlcnRzIGZyb20gZGVncmVlcyB0byByYWRpYW5zLlxuICAgIE1hZi5kZWcyUmFkID0gZnVuY3Rpb24oIGRlZ3JlZXMgKSB7XG4gICAgwqDCoHJldHVybiBkZWdyZWVzICogTWF0aC5QSSAvIDE4MDtcbiAgICB9O1xuXG4gICAgTWFmLnRvUmFkaWFucyA9IE1hZi5kZWcyUmFkO1xuXG4gICAgLy8gQ29udmVydHMgZnJvbSByYWRpYW5zIHRvIGRlZ3JlZXMuXG4gICAgTWFmLnJhZDJEZWcgPSBmdW5jdGlvbihyYWRpYW5zKSB7XG4gICAgwqDCoHJldHVybiByYWRpYW5zICogMTgwIC8gTWF0aC5QSTtcbiAgICB9O1xuXG4gICAgTWFmLnRvRGVncmVlcyA9IE1hZi5yYWQyRGVnO1xuXG4gICAgTWFmLmNsYW1wMDEgPSBmdW5jdGlvbiggdiApIHtcbiAgICAgICAgcmV0dXJuIE1hZi5jbGFtcCggdiwgMCwgMSApO1xuICAgIH07XG5cbiAgICAvLyBodHRwczovL3d3dy5vcGVuZ2wub3JnL3Nkay9kb2NzL21hbi9odG1sL21peC54aHRtbFxuXG4gICAgTWFmLm1peCA9IGZ1bmN0aW9uKCB4LCB5LCBhICkge1xuICAgICAgICBpZiggYSA8PSAwICkgcmV0dXJuIHg7XG4gICAgICAgIGlmKCBhID49IDEgKSByZXR1cm4geTtcbiAgICAgICAgcmV0dXJuIHggKyBhICogKHkgLSB4KVxuICAgIH07XG5cbiAgICBNYWYubGVycCA9IE1hZi5taXg7XG5cbiAgICBNYWYuaW52ZXJzZU1peCA9IGZ1bmN0aW9uKCBhLCBiLCB2ICkge1xuICAgICAgICByZXR1cm4gKCB2IC0gYSApIC8gKCBiIC0gYSApO1xuICAgIH07XG5cbiAgICBNYWYuaW52ZXJzZUxlcnAgPSBNYWYuaW52ZXJzZU1peDtcblxuICAgIE1hZi5taXhVbmNsYW1wZWQgPSBmdW5jdGlvbiggeCwgeSwgYSApIHtcbiAgICAgICAgaWYoIGEgPD0gMCApIHJldHVybiB4O1xuICAgICAgICBpZiggYSA+PSAxICkgcmV0dXJuIHk7XG4gICAgICAgIHJldHVybiB4ICsgYSAqICh5IC0geClcbiAgICB9O1xuXG4gICAgTWFmLmxlcnBVbmNsYW1wZWQgPSBNYWYubWl4VW5jbGFtcGVkO1xuXG4gICAgLy8gaHR0cHM6Ly93d3cub3BlbmdsLm9yZy9zZGsvZG9jcy9tYW4vaHRtbC9mcmFjdC54aHRtbFxuXG4gICAgTWFmLmZyYWN0ID0gZnVuY3Rpb24oIHYgKSB7XG4gICAgICAgIHJldHVybiB2IC0gTWF0aC5mbG9vciggdiApO1xuICAgIH07XG5cbiAgICBNYWYuZnJhYyA9IE1hZi5mcmFjdDtcblxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDk2NTMwMS9maW5kaW5nLWlmLWEtbnVtYmVyLWlzLWEtcG93ZXItb2YtMlxuXG4gICAgTWFmLmlzUG93ZXJPZlR3byA9IGZ1bmN0aW9uKCB2ICkge1xuICAgICAgICByZXR1cm4gKCAoICggdiAtIDEpICYgdiApID09IDAgKTtcbiAgICB9O1xuXG4gICAgLy8gaHR0cHM6Ly9ib2NvdXAuY29tL3dlYmxvZy9maW5kLXRoZS1jbG9zZXN0LXBvd2VyLW9mLTItd2l0aC1qYXZhc2NyaXB0XG5cbiAgICBNYWYuY2xvc2VzdFBvd2VyT2ZUd28gPSBmdW5jdGlvbiggdiApIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KCAyLCBNYXRoLnJvdW5kKCBNYXRoLmxvZyggdiApIC8gTWF0aC5sb2coIDIgKSApICk7XG4gICAgfTtcblxuICAgIE1hZi5uZXh0UG93ZXJPZlR3byA9IGZ1bmN0aW9uKCB2ICkge1xuICAgICAgICByZXR1cm4gTWF0aC5wb3coIDIsIE1hdGguY2VpbCggTWF0aC5sb2coIHYgKSAvIE1hdGgubG9nKCAyICkgKSApO1xuICAgIH1cblxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTg3ODkwNy90aGUtc21hbGxlc3QtZGlmZmVyZW5jZS1iZXR3ZWVuLTItYW5nbGVzXG5cbiAgICAvL2Z1bmN0aW9uIG1vZChhLCBuKSB7IHJldHVybiBhIC0gTWF0aC5mbG9vcihhL24pICogbjsgfVxuICAgIE1hZi5tb2QgPSBmdW5jdGlvbihhLCBuKSB7IHJldHVybiAoYSAlIG4gKyBuKSAlIG47IH1cblxuICAgIE1hZi5kZWx0YUFuZ2xlID0gZnVuY3Rpb24oIGEsIGIgKSB7XG4gICAgICAgIHZhciBkID0gTWFmLm1vZCggYiAtIGEsIDM2MCApO1xuICAgICAgICBpZiggZCA+IDE4MCApIGQgPSBNYXRoLmFicyggZCAtIDM2MCApO1xuICAgICAgICByZXR1cm4gZDtcbiAgICB9O1xuXG4gICAgTWFmLmRlbHRhQW5nbGVEZWcgPSBNYWYuZGVsdGFBbmdsZTtcblxuICAgIE1hZi5kZWx0YUFuZ2xlUmFkID0gZnVuY3Rpb24oIGEsIGIgKSB7XG4gICAgICAgIHJldHVybiBNYWYudG9SYWRpYW5zKCBNYWYuZGVsdGFBbmdsZSggTWFmLnRvRGVncmVlcyggYSApLCBNYWYudG9EZWdyZWVzKCBiICkgKSApO1xuICAgIH07XG5cbiAgICBNYWYubGVycEFuZ2xlID0gZnVuY3Rpb24oIGEsIGIsIHQgKSB7XG4gICAgICAgIHZhciBhbmdsZSA9IE1hZi5kZWx0YUFuZ2xlKCBhLCBiICk7XG4gICAgICAgIHJldHVybiBNYWYubW9kKCBhICsgTWFmLmxlcnAoIDAsIGFuZ2xlLCB0ICksIDM2MCApO1xuICAgIH07XG5cbiAgICBNYWYubGVycEFuZ2xlRGVnID0gTWFmLmxlcnBBbmdsZTtcblxuICAgIE1hZi5sZXJwQW5nbGVSYWQgPSBmdW5jdGlvbiggYSwgYiwgdCApIHtcbiAgICAgICAgcmV0dXJuIE1hZi50b1JhZGlhbnMoIE1hZi5sZXJwQW5nbGVEZWcoIE1hZi50b0RlZ3JlZXMoIGEgKSwgTWFmLnRvRGVncmVlcyggYiApLCB0ICkgKTtcbiAgICB9O1xuXG4gICAgLy8gaHR0cDovL2dhbWVkZXYuc3RhY2tleGNoYW5nZS5jb20vcXVlc3Rpb25zLzc0MzI0L2dhbW1hLXNwYWNlLWFuZC1saW5lYXItc3BhY2Utd2l0aC1zaGFkZXJcblxuICAgIE1hZi5nYW1tYVRvTGluZWFyU3BhY2UgPSBmdW5jdGlvbiggdiApIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KCB2LCAyLjIgKTtcbiAgICB9O1xuXG4gICAgTWFmLmxpbmVhclRvR2FtbWFTcGFjZSA9IGZ1bmN0aW9uKCB2ICkge1xuICAgICAgICByZXR1cm4gTWF0aC5wb3coIHYsIDEgLyAyLjIgKTtcbiAgICB9O1xuXG4gICAgTWFmLm1hcCA9IGZ1bmN0aW9uKCBmcm9tMSwgdG8xLCBmcm9tMiwgdG8yLCB2ICkge1xuICAgICAgICByZXR1cm4gZnJvbTIgKyAoIHYgLSBmcm9tMSApICogKCB0bzIgLSBmcm9tMiApIC8gKCB0bzEgLSBmcm9tMSApO1xuICAgIH1cblxuICAgIE1hZi5zY2FsZSA9IE1hZi5tYXA7XG5cbiAgICAvLyBodHRwOi8vd3d3LmlxdWlsZXpsZXMub3JnL3d3dy9hcnRpY2xlcy9mdW5jdGlvbnMvZnVuY3Rpb25zLmh0bVxuXG4gICAgTWFmLmFsbW9zdElkZW50aXR5ID0gZnVuY3Rpb24oIHgsIG0sIG4gKSB7XG5cbiAgICAgICAgaWYoIHggPiBtICkgcmV0dXJuIHg7XG5cbiAgICAgICAgdmFyIGEgPSAyICogbiAtIG07XG4gICAgICAgIHZhciBiID0gMiAqIG0gLSAzICogbjtcbiAgICAgICAgdmFyIHQgPSB4IC8gbTtcblxuICAgICAgICByZXR1cm4gKCBhICogdCArIGIpICogdCAqIHQgKyBuO1xuICAgIH1cblxuICAgIE1hZi5pbXB1bHNlID0gZnVuY3Rpb24oIGssIHggKSB7XG4gICAgICAgIHZhciBoID0gayAqIHg7XG4gICAgICAgIHJldHVybiBoICogTWF0aC5leHAoIDEgLSBoICk7XG4gICAgfTtcblxuICAgIE1hZi5jdWJpY1B1bHNlID0gZnVuY3Rpb24oIGMsIHcsIHggKSB7XG4gICAgICAgIHggPSBNYXRoLmFicyggeCAtIGMgKTtcbiAgICAgICAgaWYoIHggPiB3ICkgcmV0dXJuIDA7XG4gICAgICAgIHggLz0gdztcbiAgICAgICAgcmV0dXJuIDEgLSB4ICogeCAqICggMyAtIDIgKiB4ICk7XG4gICAgfVxuXG4gICAgTWFmLmV4cFN0ZXAgPSBmdW5jdGlvbiggeCwgaywgbiApIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZXhwKCAtayAqIE1hdGgucG93KCB4LCBuICkgKTtcbiAgICB9XG5cbiAgICBNYWYucGFyYWJvbGEgPSBmdW5jdGlvbiggeCwgayApIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KCA0ICogeCAqICggMSAtIHggKSwgayApO1xuICAgIH1cblxuICAgIE1hZi5wb3dlckN1cnZlID0gZnVuY3Rpb24oIHgsIGEsIGIgKSB7XG4gICAgICAgIHZhciBrID0gTWF0aC5wb3coIGEgKyBiLCBhICsgYiApIC8gKCBNYXRoLnBvdyggYSwgYSApICogTWF0aC5wb3coIGIsIGIgKSApO1xuICAgICAgICByZXR1cm4gayAqIE1hdGgucG93KCB4LCBhICkgKiBNYXRoLnBvdyggMSAtIHgsIGIgKTtcbiAgICB9XG5cbiAgICAvLyBodHRwOi8vaXF1aWxlemxlcy5vcmcvd3d3L2FydGljbGVzL3NtaW4vc21pbi5odG0gP1xuXG4gICAgTWFmLmxhdExvblRvQ2FydGVzaWFuID0gZnVuY3Rpb24oIGxhdCwgbG9uICkge1xuXG4gICAgICAgIGxvbiArPSAxODA7XG4gICAgICAgIGxhdCA9IE1hZi5jbGFtcCggbGF0LCAtODUsIDg1ICk7XG4gICAgICAgIHZhciBwaGkgPSBNYWYudG9SYWRpYW5zKCA5MCAtIGxhdCApO1xuICAgICAgICB2YXIgdGhldGEgPSBNYWYudG9SYWRpYW5zKCAxODAgLSBsb24gKTtcbiAgICAgICAgdmFyIHggPSBNYXRoLnNpbiggcGhpICkgKiBNYXRoLmNvcyggdGhldGEgKTtcbiAgICAgICAgdmFyIHkgPSBNYXRoLmNvcyggcGhpICk7XG4gICAgICAgIHZhciB6ID0gTWF0aC5zaW4oIHBoaSApICogTWF0aC5zaW4oIHRoZXRhICk7XG5cbiAgICAgICAgcmV0dXJuIHsgeDogeCwgeTogeSwgejogeiB9XG5cbiAgICB9XG5cbiAgICBNYWYuY2FydGVzaWFuVG9MYXRMb24gPSBmdW5jdGlvbiggeCwgeSwgeiApIHtcbiAgICAgICAgdmFyIG4gPSBNYXRoLnNxcnQoIHggKiB4ICsgeSAqIHkgKyB6ICogeiApO1xuICAgICAgICByZXR1cm57IGxhdDogTWF0aC5hc2luKCB6IC8gbiApLCBsb246IE1hdGguYXRhbjIoIHksIHggKSB9O1xuICAgIH1cblxuICAgIE1hZi5yYW5kb21JblJhbmdlID0gZnVuY3Rpb24oIG1pbiwgbWF4ICkge1xuICAgICAgICByZXR1cm4gbWluICsgTWF0aC5yYW5kb20oKSAqICggbWF4IC0gbWluICk7XG4gICAgfVxuXG4gICAgTWFmLm5vcm0gPSBmdW5jdGlvbiggdiwgbWluVmFsLCBtYXhWYWwgKSB7XG4gICAgICAgIHJldHVybiAoIHYgLSBtaW5WYWwgKSAvICggbWF4VmFsIC0gbWluVmFsICk7XG4gICAgfVxuXG4gICAgTWFmLmhhc2ggPSBmdW5jdGlvbiggbiApIHtcbiAgICAgICAgcmV0dXJuIE1hZi5mcmFjdCggKDEuMCArIE1hdGguY29zKG4pKSAqIDQxNS45MjY1Myk7XG4gICAgfVxuXG4gICAgTWFmLm5vaXNlMmQgPSBmdW5jdGlvbiggeCwgeSApIHtcbiAgICAgICAgdmFyIHhoYXNoID0gTWFmLmhhc2goIHggKiAzNy4wICk7XG4gICAgICAgIHZhciB5aGFzaCA9IE1hZi5oYXNoKCB5ICogNTcuMCApO1xuICAgICAgICByZXR1cm4gTWFmLmZyYWN0KCB4aGFzaCArIHloYXNoICk7XG4gICAgfVxuXG4gICAgLy8gaHR0cDovL2lxdWlsZXpsZXMub3JnL3d3dy9hcnRpY2xlcy9zbWluL3NtaW4uaHRtXG5cbiAgICBNYWYuc21vb3RoTWluID0gZnVuY3Rpb24oIGEsIGIsIGsgKSB7XG4gICAgICAgIHZhciByZXMgPSBNYXRoLmV4cCggLWsqYSApICsgTWF0aC5leHAoIC1rKmIgKTtcbiAgICAgICAgcmV0dXJuIC0gTWF0aC5sb2coIHJlcyApL2s7XG4gICAgfVxuXG4gICAgTWFmLnNtb290aE1heCA9IGZ1bmN0aW9uKCBhLCBiLCBrICl7XG4gICAgICAgIHJldHVybiBNYXRoLmxvZyggTWF0aC5leHAoYSkgKyBNYXRoLmV4cChiKSApL2s7XG4gICAgfVxuXG4gICAgTWFmLmFsbW9zdCA9IGZ1bmN0aW9uKCBhLCBiICkge1xuICAgICAgICByZXR1cm4gKCBNYXRoLmFicyggYSAtIGIgKSA8IC4wMDAxICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hZjtcblxufSgpKTtcblxuZXhwb3J0IGRlZmF1bHQgTWFmO1xuIl19
