// ---- Texturas generadas por código ----
function glowTex() {
  const c = mk(128, 128), g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,225,140,.55)');
  gr.addColorStop(.6, 'rgba(255,170,40,.15)'); gr.addColorStop(1, 'rgba(255,150,20,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
function ringTex() {
  const c = mk(256, 256), g = c.getContext('2d');
  const gr = g.createRadialGradient(128, 128, 96, 128, 128, 126);
  gr.addColorStop(0, 'rgba(255,200,80,0)'); gr.addColorStop(.55, 'rgba(255,230,150,.95)'); gr.addColorStop(1, 'rgba(255,180,50,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}
function nebTex(rgb) {
  const c = mk(256, 256), g = c.getContext('2d');
  for (let i = 0; i < 28; i++) {
    const x = 40 + R() * 176, y = 40 + R() * 176, r = 30 + R() * 70;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${rgb},${.06 + R() * .1})`); gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  }
  g.globalCompositeOperation = 'destination-in';
  const m = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(.65, 'rgba(0,0,0,.55)'); m.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = m; g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}
function petal(g, r0, len, wid) {
  g.beginPath(); g.moveTo(r0, 0);
  g.bezierCurveTo(r0 + len * .22, -wid, r0 + len * .68, -wid * .95, r0 + len, 0);
  g.bezierCurveTo(r0 + len * .68, wid * .95, r0 + len * .22, wid, r0, 0); g.closePath();
}
function drawHead(g, cx, cy, Rr) {
  const cr = Rr * .36;
  g.save(); g.translate(cx, cy);
  [[22, .5, .82, .16, '#e08a00', '#ffbd14'], [22, 0, 1, .165, '#ffc21a', '#fff06a']].forEach(([n, off, l, w, c0, c1]) => {
    for (let i = 0; i < n; i++) {
      g.save(); g.rotate((i + off) / n * TAU);
      const r0 = cr * .82, len = (Rr - cr * .85) * l, wid = Rr * w;
      const gr = g.createLinearGradient(r0, 0, r0 + len, 0); gr.addColorStop(0, c0); gr.addColorStop(1, c1);
      g.fillStyle = gr; petal(g, r0, len, wid); g.fill();
      g.strokeStyle = 'rgba(190,100,0,.35)'; g.lineWidth = Math.max(1, Rr * .01);
      g.beginPath(); g.moveTo(r0 + len * .1, 0); g.lineTo(r0 + len * .82, 0); g.stroke();
      g.restore();
    }
  });
  const cg = g.createRadialGradient(0, 0, 0, 0, 0, cr);
  cg.addColorStop(0, '#7b4514'); cg.addColorStop(.6, '#4a2508'); cg.addColorStop(1, '#2c1404');
  g.fillStyle = cg; g.beginPath(); g.arc(0, 0, cr, 0, TAU); g.fill();
  const M = 220, ga = 2.39996323;
  for (let i = 1; i < M; i++) {
    const rr = Math.sqrt(i / M) * cr * .94, a = i * ga;
    g.fillStyle = i % 3 ? '#20100a' : '#b87428';
    g.beginPath(); g.arc(Math.cos(a) * rr, Math.sin(a) * rr, cr * (.012 + .03 * (i / M)), 0, TAU); g.fill();
  }
  g.strokeStyle = 'rgba(210,140,40,.65)'; g.lineWidth = Math.max(1.5, Rr * .02);
  g.beginPath(); g.arc(0, 0, cr, 0, TAU); g.stroke();
  g.restore();
}
function leaf(g, x, y, len, ang) {
  g.save(); g.translate(x, y); g.rotate(ang); g.fillStyle = '#3f8a2c';
  g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(len * .5, -len * .28, len, 0); g.quadraticCurveTo(len * .5, len * .22, 0, 0); g.fill();
  g.strokeStyle = 'rgba(20,70,20,.6)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, 0); g.lineTo(len * .9, 0); g.stroke();
  g.restore();
}
const headTex = (() => { const c = mk(512, 512); drawHead(c.getContext('2d'), 256, 256, 244); return new THREE.CanvasTexture(c); })();
const stemTex = (() => {
  const c = mk(256, 384), g = c.getContext('2d');
  g.strokeStyle = '#3b7d2a'; g.lineWidth = 9; g.lineCap = 'round';
  g.beginPath(); g.moveTo(128, 190); g.quadraticCurveTo(120, 290, 128, 372); g.stroke();
  leaf(g, 124, 300, 70, -.5); leaf(g, 124, 332, 64, Math.PI + .5);
  drawHead(g, 128, 110, 98);
  return new THREE.CanvasTexture(c);
})();
const bouquetTex = (() => {
  const c = mk(384, 384), g = c.getContext('2d');
  g.strokeStyle = '#3b7d2a'; g.lineWidth = 8; g.lineCap = 'round';
  [[110, 120], [192, 86], [276, 124], [150, 170], [236, 168]].forEach(([x, y]) => {
    g.beginPath(); g.moveTo(192, 372); g.quadraticCurveTo((192 + x) / 2, (372 + y) / 2 + 30, x, y); g.stroke();
  });
  leaf(g, 175, 290, 70, Math.PI + .6); leaf(g, 210, 296, 70, -.6);
  g.fillStyle = 'rgba(130,78,34,.95)'; g.beginPath(); g.moveTo(158, 300); g.lineTo(226, 300); g.lineTo(212, 382); g.lineTo(172, 382); g.closePath(); g.fill();
  drawHead(g, 150, 170, 52); drawHead(g, 236, 168, 52); drawHead(g, 110, 120, 64); drawHead(g, 276, 124, 64); drawHead(g, 192, 86, 72);
  return new THREE.CanvasTexture(c);
})();
const glow = glowTex(), ringT = ringTex();
const glowSprite = (col, order) => {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: col, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  s.renderOrder = order; s.visible = false; scene.add(s); return s;
};
