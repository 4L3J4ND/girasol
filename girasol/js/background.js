// ---- Nebulosa (sprites lejanos) ----
const nebs = [
  { p: [-32, 16, -62], s: 90, c: '140,80,220', o: .9, w: .012 },
  { p: [36, -2, -74], s: 100, c: '50,110,215', o: .8, w: -.009 },
  { p: [12, 28, -84], s: 80, c: '225,80,165', o: .6, w: .008 },
  { p: [-22, -10, -58], s: 66, c: '255,160,60', o: .45, w: -.011 }
].map(n => {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: nebTex(n.c), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: n.o }));
  s.position.set(...n.p); s.scale.set(n.s, n.s, 1); s.renderOrder = -2; scene.add(s); n.sp = s; return n;
});

// ---- Estrellas doradas titilantes ----
const stars = (() => {
  const N = 3200, pos = new Float32Array(N * 3), seed = new Float32Array(N), size = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const v = new THREE.Vector3(gauss(), gauss(), gauss()).normalize().multiplyScalar(70 + R() * 70);
    pos.set([v.x, v.y, v.z], i * 3); seed[i] = R(); size[i] = R() < .08 ? 4 + R() * 3 : 1.2 + R() * 2;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  const m = shader(`
    attribute float aSeed; attribute float aSize; varying float vA; varying float vS;
    void main(){
      vec4 mv = modelViewMatrix * vec4(position,1.);
      gl_Position = projectionMatrix * mv;
      float tw = .5 + .5*sin(uTime*(.6+aSeed*2.2) + aSeed*40.);
      gl_PointSize = aSize * uPx * (.6 + .8*tw);
      vA = .2 + .8*tw; vS = aSeed;
    }`, `
    varying float vA; varying float vS;
    void main(){
      float d = length(gl_PointCoord - .5);
      float a = smoothstep(.5, .0, d);
      vec3 col = mix(vec3(1.,.8,.35), vec3(1.,.96,.8), vS);
      gl_FragColor = vec4(col, a*vA);
    }`);
  const p = new THREE.Points(g, m); p.renderOrder = -1; p.frustumCulled = false; scene.add(p); return p;
})();

// ---- Galaxia de polvo dorado (espiral) ----
const galU = { uGal: { value: .3 } };
const galaxy = (() => {
  const N = 90000, pos = new Float32Array(N * 3), size = new Float32Array(N), seed = new Float32Array(N), rad = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let r, ang;
    if (R() < .2) { r = Math.sqrt(R()) * 12.5 + .2; ang = R() * TAU; }
    else { r = Math.pow(R(), .75) * 12 + .3; ang = r * .62 + ((R() * 3) | 0) * TAU / 3 + gauss() * (.1 + r * .03); }
    pos.set([Math.cos(ang) * r, gauss() * .1 * (1 - r / 15), Math.sin(ang) * r], i * 3);
    size[i] = 1.4 + R() * R() * 4.2; seed[i] = R(); rad[i] = r;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  g.setAttribute('aR', new THREE.BufferAttribute(rad, 1));
  const m = shader(`
    attribute float aSize; attribute float aSeed; attribute float aR; uniform float uGal; varying float vA; varying vec3 vC;
    void main(){
      float ang = uTime * (.95 / (1. + aR*.35));
      float c = cos(ang), s = sin(ang);
      vec3 p = vec3(position.x*c - position.z*s, position.y, position.x*s + position.z*c);
      vec4 mv = modelViewMatrix * vec4(p,1.);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = aSize * uPx * (15. / (-mv.z));
      float tw = .6 + .4*sin(uTime*(1.+aSeed*3.) + aSeed*30.);
      vA = uGal * tw * (1. - smoothstep(9., 13., aR)*.6);
      vC = mix(vec3(1.,.96,.82), vec3(1.,.72,.18), smoothstep(0., 9., aR));
    }`, `
    varying float vA; varying vec3 vC;
    void main(){
      float d = length(gl_PointCoord - .5);
      float a = smoothstep(.5, .0, d);
      gl_FragColor = vec4(vC, a*vA*.55);
    }`, galU);
  const p = new THREE.Points(g, m); p.frustumCulled = false; p.renderOrder = 0; scene.add(p); return p;
})();
const core = glowSprite(0xffd27a, 1); core.position.set(0, .15, 0); core.visible = true;
