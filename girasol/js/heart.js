// ---- Corazón paramétrico de partículas (explosión -> corazón) ----
const heartU = { uU: { value: 0 }, uFade: { value: 0 }, uAngle: { value: 0 }, uForm: { value: 0 } };
const heart = (() => {
  const N = 9000, k = .17;
  const tgt = new Float32Array(N * 3), sc = new Float32Array(N * 3), del = new Float32Array(N), size = new Float32Array(N), seed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const a = R() * TAU, edge = R() < .42, r = edge ? .96 + R() * .06 : Math.pow(R(), .45);
    const hx = 16 * Math.pow(Math.sin(a), 3);
    const hy = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a);
    tgt.set([hx * r * k, (hy - 2) * r * k, (R() - .5) * 1.6 * (1 - r * .4)], i * 3);
    const d = new THREE.Vector3(gauss(), gauss(), gauss()).normalize().multiplyScalar((.4 + R() * .8) * 8);
    sc.set([d.x, d.y, d.z], i * 3);
    del[i] = R() * .45; size[i] = 1.8 + R() * 3.4; seed[i] = R();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(tgt, 3));
  g.setAttribute('aScatter', new THREE.BufferAttribute(sc, 3));
  g.setAttribute('aDelay', new THREE.BufferAttribute(del, 1));
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const m = shader(`
    attribute vec3 aScatter; attribute float aDelay; attribute float aSize; attribute float aSeed;
    uniform float uU; uniform float uFade; uniform float uAngle; uniform float uForm;
    varying float vA; varying float vS;
    float eOut(float x){ float y = 1.-x; return 1.-y*y*y; }
    float eIO(float x){ return x < .5 ? 4.*x*x*x : 1. - pow(-2.*x+2., 3.)/2.; }
    void main(){
      float ex = eOut(clamp(uU/.85, 0., 1.));
      vec3 b = aScatter * ex;
      float c = eIO(clamp((uU - 1. - aDelay)/1.45, 0., 1.));
      float ca = cos(uAngle), sa = sin(uAngle);
      vec3 t = position * (1. + .025*sin(uTime*4.2)*uForm);
      t = vec3(t.x*ca + t.z*sa, t.y, -t.x*sa + t.z*ca);
      vec3 p = mix(b, t, c);
      p += (1.-c) * .3 * vec3(sin(uTime*1.3 + aSeed*6.28), cos(uTime*1.1 + aSeed*9.), sin(uTime + aSeed*4.));
      p *= 1. + uFade*.22;
      vec4 mv = modelViewMatrix * vec4(p,1.);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = aSize * uPx * (15. / (-mv.z)) * (1. + uFade*.4);
      vA = clamp(uU/.25, 0., 1.) * (1. - uFade) * (.55 + .45*sin(uTime*5. + aSeed*6.283));
      vS = aSeed;
    }`, `
    varying float vA; varying float vS;
    void main(){
      float d = length(gl_PointCoord - .5);
      float a = smoothstep(.5, .0, d);
      vec3 col = mix(vec3(1.,.72,.2), vec3(1.,.95,.72), vS);
      gl_FragColor = vec4(col, a*a*vA*1.3);
    }`, heartU);
  const p = new THREE.Points(g, m); p.position.y = CY; p.frustumCulled = false; p.renderOrder = 4; p.visible = false; scene.add(p); return p;
})();
const heartGlow = glowSprite(0xffc850, 1); heartGlow.position.set(0, CY, 0);
