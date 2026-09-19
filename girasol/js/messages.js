// ---- Anillo-guía de los mensajes ----
const ringPts = (() => {
  const N = 420, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { const a = i / N * TAU; pos.set([Math.cos(a), 0, Math.sin(a)], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ map: glow, size: .16, color: 0xffd97a, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  p.renderOrder = 1; p.visible = false; scene.add(p); return p;
})();

// ---- Mensajes (DOM + CSS) que orbitan sobre el plano de la galaxia ----
const A = 'Contigo siempre será 21 de septiembre 🌻', B = 'Flores amarillas para ti 🌻';
const MSG = [
  { text: A, t0: 3.4, t1: 8.6, dir: 1 },
  { text: B, t0: 8.9, t1: 14.1, dir: -1 },
  { text: A, t0: 14.4, t1: 19.6, dir: 1 },
  { text: B, t0: 19.9, t1: 25.1, dir: -1 }
];
const msgEl = document.getElementById('msgs');
const mctx = mk(4, 4).getContext('2d');
const FS = 30;
let MS = [];
const splitLines = t => { const w = t.split(' '), h = Math.ceil(w.length / 2); return [w.slice(0, h).join(' '), w.slice(h).join(' ')]; };
function buildMessages() {
  msgEl.innerHTML = ''; MS = [];
  mctx.font = `700 ${FS}px "Dancing Script","Segoe Script","Brush Script MT",cursive`;
  const narrow = W < 720;
  for (const m of MSG) {
    const div = document.createElement('div'); div.className = 'msg'; msgEl.appendChild(div);
    const lines = (narrow ? splitLines(m.text) : [m.text]).map(line => {
      const chars = Array.from(line);
      const adv = chars.map(ch => mctx.measureText(ch).width || 8);
      const els = chars.map(ch => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; div.appendChild(s); return s; });
      return { adv, total: adv.reduce((a, b) => a + b, 0), els };
    });
    MS.push({ ...m, div, lines, on: false });
  }
}
const v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
const scr = v => { v.project(camera); return [(v.x * .5 + .5) * W, (-v.y * .5 + .5) * H]; };

function updateMessages(t) {
  const tanH = Math.tan(FOV * Math.PI / 360);
  const Rm = 7 * rs, h = .5;
  const k = H / (2 * Math.max(3, camDist - Rm) * tanH);           // px por unidad en el frente del anillo
  const target = clamp(S * .05, 18, 40) * (W < 720 ? .92 : 1);
  const wp = target / (FS * k), gap = FS * wp * 1.2;
  let ringA = 0;
  for (const m of MS) {
    if (!(t >= m.t0 && t < m.t1)) { if (m.on) { m.div.classList.remove('on'); m.on = false; } continue; }
    if (!m.on) {
      m.div.style.setProperty('--dur', (m.t1 - m.t0) + 's');
      m.div.style.animationDelay = `-${(t - m.t0).toFixed(3)}s`;
      m.div.classList.add('on'); m.on = true;
    }
    const p = (t - m.t0) / (m.t1 - m.t0);
    ringA = Math.max(ringA, clamp(p / .16) * clamp((1 - p) / .2) * .5);
    const thc = Math.PI / 2 + m.dir * (.5 - p) * 1.5;
    m.lines.forEach((ln, li) => {
      const Rr = Rm + li * gap, half = ln.total * wp / 2;
      let acc = 0;
      for (let i = 0; i < ln.els.length; i++) {
        const s = (acc + ln.adv[i] / 2) * wp - half; acc += ln.adv[i];
        const th = thc - s / Rr, c = Math.cos(th), sn = Math.sin(th);
        v0.set(Rr * c, h, Rr * sn); const p0 = scr(v0.clone());
        v1.set(Rr * c + sn * wp, h, Rr * sn - c * wp); const pT = scr(v1);
        v2.set(Rr * c - c * wp, h, Rr * sn - sn * wp); const pU = scr(v2);
        const a = pT[0] - p0[0], b = pT[1] - p0[1], cc = -(pU[0] - p0[0]), d = -(pU[1] - p0[1]);
        const el = ln.els[i];
        el.style.transform = `matrix(${a},${b},${cc},${d},${p0[0]},${p0[1]}) translate(${-ln.adv[i] / 2}px,${-FS * .78}px)`;
        el.style.opacity = sstep(-.15, .4, sn).toFixed(3);
      }
    });
  }
  ringPts.visible = ringA > .01; ringPts.scale.set(Rm, 1, Rm); ringPts.position.y = h; ringPts.material.opacity = ringA;
}
