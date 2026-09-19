// ---- Corazoncitos que brotan del corazón ----
const miniHeartTex = (() => {
  const c = mk(128, 128), g = c.getContext('2d');
  const gl = g.createRadialGradient(64, 64, 10, 64, 64, 62);
  gl.addColorStop(0, 'rgba(255,200,90,.55)'); gl.addColorStop(1, 'rgba(255,150,40,0)');
  g.fillStyle = gl; g.fillRect(0, 0, 128, 128);
  g.beginPath();
  for (let i = 0; i <= 80; i++) {
    const a = i / 80 * TAU, x = 16 * Math.pow(Math.sin(a), 3);
    const y = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a);
    const px = 64 + x * 2.6, py = 62 - (y - 1) * 2.6;
    i ? g.lineTo(px, py) : g.moveTo(px, py);
  }
  g.closePath();
  const fg = g.createRadialGradient(64, 58, 4, 64, 62, 46);
  fg.addColorStop(0, '#fff6d0'); fg.addColorStop(.5, '#ffc93a'); fg.addColorStop(1, '#ff8a3d');
  g.fillStyle = fg; g.fill(); g.lineWidth = 2; g.strokeStyle = 'rgba(255,240,190,.9)'; g.stroke();
  return new THREE.CanvasTexture(c);
})();
const miniHearts = Array.from({ length: 34 }, () => {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: miniHeartTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  s.renderOrder = 6; s.visible = false; scene.add(s);
  const a = R() * TAU;
  return { s, t0: T_HEART + .5 + R() * 5.6, life: 3 + R() * 2.2, dx: Math.cos(a) * (1.5 + R() * 4.5), dz: Math.sin(a) * (1.5 + R() * 3),
           dy: (R() - .2) * 2.5, rise: 1.2 + R() * 2, size: .35 + R() * .55, ph: R() * TAU };
});

// ---- Lluvia de meteoros de fondo ----
const meteorGeo = new THREE.PlaneGeometry(1, 1); meteorGeo.translate(-.5, 0, 0);
const meteorMat = () => new THREE.ShaderMaterial({
  uniforms: { uA: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
  fragmentShader: `varying vec2 vUv; uniform float uA;
    void main(){
      float along = pow(vUv.x, 2.6);
      float across = pow(1. - smoothstep(0., .5, abs(vUv.y - .5)), 1.6);
      float head = smoothstep(.9, 1., vUv.x);
      vec3 col = mix(vec3(1., .72, .25), vec3(1., .97, .85), head);
      gl_FragColor = vec4(col, (along*across + head*across*.8) * uA);
    }`
});
const meteors = Array.from({ length: 55 }, () => {
  const m = new THREE.Mesh(meteorGeo, meteorMat()); m.renderOrder = -1; m.visible = false; m.frustumCulled = false; scene.add(m);
  return { m, life: .9 + R() * .9, gap: .2 + R() * 2.0, off: R() * 12, cyc: -1 };
});
function updateMeteors(now) { 
  const tanH = Math.tan(FOV * Math.PI / 360);
  for (const q of meteors) {
    const per = q.life + q.gap, x = (now + q.off) / per, cyc = Math.floor(x), lt = (x - cyc) * per;
    if (cyc !== q.cyc) {
      q.cyc = cyc; q.z = -12 - R() * 38;
      const dist = camDist - q.z, halfW = dist * tanH * camera.aspect, top = camDist * .36 + dist * .21;
      q.sx = (R() * 2 - 1.3) * halfW; q.sy = top * (.55 + R() * .6);
      q.ang = (-32 + (R() - .5) * 16) * D2R; q.len = 5 + R() * 9; q.dist = 26 + R() * 26; q.thick = .12 + R() * .16;
    }
    if (lt > q.life) { q.m.visible = false; continue; }
    const p = lt / q.life;
    q.m.visible = true;
    q.m.position.set(q.sx + Math.cos(q.ang) * q.dist * p, q.sy + Math.sin(q.ang) * q.dist * p, q.z);
    q.m.rotation.z = q.ang;
    q.m.scale.set(q.len * (1 + -q.z / 40), q.thick * (1 + -q.z / 22), 1);
    q.m.material.uniforms.uA.value = sstep(0, .12, p) * (1 - sstep(.55, 1, p)) * .9;
  }
}
