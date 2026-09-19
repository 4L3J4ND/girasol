// ---- Tamaño / cámara ----
const par = { x: 0, y: 0, tx: 0, ty: 0 };
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight; S = Math.min(W, H);
  renderer.setPixelRatio(dpr); renderer.setSize(W, H, false); uPx.value = dpr;
  const asp = W / H;
  camera.aspect = asp; camera.updateProjectionMatrix();
  camDist = asp >= 1 ? 15 : 15 + (1 - asp) * 11;
  rs = asp >= 1 ? 1 : .55 + .45 * asp;
  buildMessages();
}
window.addEventListener('resize', resize);
window.addEventListener('pointermove', e => { par.tx = e.clientX / W - .5; par.ty = e.clientY / H - .5; });
let start = performance.now();
cv.addEventListener('click', () => { start = performance.now(); });
resize();
if (document.fonts && document.fonts.load) document.fonts.load('700 30px "Dancing Script"').then(buildMessages, () => {});

// ---- Bucle ----
function frame(now) {
  const t = ((now - start) / 1000) % LOOP;
  uTime.value = now / 1000;
  par.x += (par.tx - par.x) * .04; par.y += (par.ty - par.y) * .04;
  camera.position.set(Math.sin(t * .12) * 1.4 + par.x * 2.6, camDist * .36 + Math.sin(t * .17) * .3 + par.y * 1.6, camDist);
  camera.lookAt(0, 1.9, 0); camera.updateMatrixWorld(true);

  const endFade = 1 - eIO(clamp((t - (T_END - 1.4)) / 1.4));
  stars.rotation.y = t * .004;
  nebs.forEach((n, i) => { n.sp.material.rotation = t * n.w; n.sp.position.x += Math.sin(t * .05 + i) * .002; });

  // corazón
  const u1 = t - T_HEART, fade = eIO(clamp((t - T_FADE0) / (T_FADE1 - T_FADE0)));
  heart.visible = t >= T_HEART && t <= T_FADE1 + .2;
  heartU.uU.value = u1; heartU.uFade.value = fade; heartU.uAngle.value = Math.max(0, t - 2.4) * .62;
  heartU.uForm.value = eIO(clamp((u1 - 1.4) / 1.6));
  const hg = heart.visible ? (.16 * heartU.uForm.value + .35 * Math.sin(Math.PI * fade)) * (1 - Math.max(0, fade - .9) * 10) : 0;
  heartGlow.visible = hg > .005; heartGlow.material.opacity = Math.max(0, hg); heartGlow.scale.set(9, 9, 1);

  // explosiones
  const v2t = t - T_BOOM2;
  let fo = 0, fsz = 1;
  if (u1 >= 0 && u1 < .9) { fo = .9 * (1 - u1 / .9); fsz = 4 + 16 * eOut(u1 / .9); }
  if (v2t >= 0 && v2t < 1.3) { fo = .95 * (1 - v2t / 1.3); fsz = 6 + 30 * eOut(v2t / 1.3); }
  flash.visible = fo > 0; flash.material.opacity = fo; flash.scale.set(fsz, fsz, 1);
  ringS.visible = v2t >= 0 && v2t < 1.5;
  if (ringS.visible) { const s = 3 + 26 * eOut(v2t / 1.5); ringS.scale.set(s, s, 1); ringS.material.opacity = .7 * (1 - v2t / 1.5); }
  shock1.visible = u1 >= 0 && u1 < 1.6;
  if (shock1.visible) { const s = 1 + 9 * eOut(u1 / 1.6); shock1.scale.set(s, s, 1); shock1.material.opacity = .5 * (1 - u1 / 1.6); }
  shock2.visible = v2t >= 0 && v2t < 2;
  if (shock2.visible) { const s = 1 + 15 * eOut(v2t / 2); shock2.scale.set(s, s, 1); shock2.material.opacity = .7 * (1 - v2t / 2); }
  burst.visible = v2t >= 0 && v2t < 3; burstU.uV.value = Math.max(0, v2t);

  // girasol principal
  const sv = t - T_BOOM2 - .25;
  mainFlower.visible = sv > 0;
  if (mainFlower.visible) {
    const g = eBack(clamp(sv / 1.8)), bl = eOut(clamp(sv / 2.2)), sz = 5.6 * g;
    mainFlower.scale.set(sz, sz, 1); mainFlower.material.rotation = (t - T_BOOM2) * .07;
    mainFlower.material.opacity = endFade * clamp(sv / .4);
    mainGlow.visible = true; mainGlow.scale.set(13 * bl, 13 * bl, 1); mainGlow.material.opacity = .5 * bl * endFade;
  } else mainGlow.visible = false;

  // flores flotantes
  for (const f of flowers) {
    const ap = eBack(clamp((t - T_BOOM2 - 1.2 - f.delay) / 1.3));
    const on = ap > .001;
    f.s.visible = f.g.visible = on;
    if (!on) continue;
    const ang = f.a + (t - T_BOOM2) * f.w;
    const x = Math.cos(ang) * f.r, z = Math.sin(ang) * f.r, y = f.y + Math.sin(t * f.bs + f.ph) * .16;
    f.s.position.set(x, y, z); f.s.scale.set(f.sx * ap, f.sy * ap, 1);
    f.s.material.opacity = endFade * clamp(ap * 2); f.s.material.rotation = Math.sin(t * .6 + f.ph) * .1;
    f.g.position.set(x, y, z); f.g.scale.set(f.glow * ap, f.glow * ap, 1); f.g.material.opacity = .32 * endFade;
  }

  // corazoncitos
  for (const h of miniHearts) {
    const p = (t - h.t0) / h.life;
    if (p < 0 || p > 1) { h.s.visible = false; continue; }
    const e = eOut(clamp(p * 2.2));
    h.s.visible = true;
    h.s.position.set(h.dx * e + Math.sin(t * 1.5 + h.ph) * .25, CY + h.dy * e + h.rise * p, h.dz * e);
    const sc = h.size * (.35 + .65 * e) * (1 + .08 * Math.sin(t * 6 + h.ph));
    h.s.scale.set(sc, sc, 1);
    h.s.material.opacity = Math.pow(Math.sin(Math.PI * p), .6) * .95;
    h.s.material.rotation = Math.sin(t * 1.2 + h.ph) * .35;
  }
  updateMeteors(uTime.value);

  // galaxia
  const gl = .5 + .7 * eIO(clamp((t - (T_BOOM2 - .5)) / 3)) * endFade + .12 * Math.sin(Math.PI * clamp((t - T_HEART) / 2));
  galU.uGal.value = gl; core.material.opacity = .5 * gl; core.scale.set(5, 5, 1);

  updateMessages(t);
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(now => { start = now; frame(now); });
