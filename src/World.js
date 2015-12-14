/*global THREE:false*/

function World (container) {
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
    raycaster,
    container
  };
}

export default World;
