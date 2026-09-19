// ---- Segunda explosión (chispas + destello + onda) ----
const burstU = { uV: { value: 0 } };
const burst = (() => {
  const N = 3000, pos = new Float32Array(N * 3), dir = new Float32Array(N * 3), sp = new Float32Array(N), life = new Float32Array(N), size = new Float32Array(N), seed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const d = new THREE.Vector3(gauss(), gauss(), gauss()).normalize();
    dir.set([d.x, d.y, d.z], i * 3); sp[i] = 3 + R() * 13; life[i] = 1.3 + R() * 1.4; size[i] = 1.6 + R() * 3.2; seed[i] = R();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aDir', new THREE.BufferAttribute(dir, 3));
  g.setAttribute('aSpeed', new THREE.BufferAttribute(sp, 1));
  g.setAttribute('aLife', new THREE.BufferAttribute(life, 1));
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const m = shader(`
    attribute vec3 aDir; attribute float aSpeed; attribute float aLife; attribute float aSize; attribute float aSeed;
    uniform float uV; varying float vA; varying float vS;
    void main(){
      float d = aSpeed * (1. - exp(-2.2*uV)) / 2.2;
      vec3 p = aDir * d; p.y -= uV*uV*.5;
      vec4 mv = modelViewMatrix * vec4(p,1.);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = aSize * uPx * (15. / (-mv.z));
      vA = pow(clamp(1. - uV/aLife, 0., 1.), 1.5);
      vS = aSeed;
    }`, `
    varying float vA; varying float vS;
    void main(){
      float d = length(gl_PointCoord - .5);
      float a = smoothstep(.5, .0, d);
      vec3 col = mix(vec3(1.,.72,.2), vec3(1.,.96,.75), vS);
      gl_FragColor = vec4(col, a*a*vA*1.4);
    }`, burstU);
  const p = new THREE.Points(g, m); p.position.y = CY; p.frustumCulled = false; p.renderOrder = 4; p.visible = false; scene.add(p); return p;
})();
const flash = glowSprite(0xfff1c4, 5); flash.position.set(0, CY, 0);
const ringS = new THREE.Sprite(new THREE.SpriteMaterial({ map: ringT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
ringS.position.set(0, CY, 0); ringS.renderOrder = 5; ringS.visible = false; scene.add(ringS);
const shock = () => {
  const m = new THREE.Mesh(new THREE.RingGeometry(.92, 1, 128), new THREE.MeshBasicMaterial({ color: 0xffd060, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  m.rotation.x = -Math.PI / 2; m.position.y = .03; m.visible = false; m.renderOrder = 1; scene.add(m); return m;
};
const shock1 = shock(), shock2 = shock();
