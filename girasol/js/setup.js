// ---- Renderer / escena ----
const cv = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(FOV, 1, .1, 500);
let W = 1, H = 1, S = 1, camDist = 15, rs = 1;

const uTime = { value: 0 }, uPx = { value: 1 };
const shader = (vertexShader, fragmentShader, uniforms) => new THREE.ShaderMaterial({
  vertexShader: 'uniform float uTime; uniform float uPx;\n' + vertexShader, fragmentShader, uniforms: Object.assign({ uTime, uPx }, uniforms || {}),
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
});
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
