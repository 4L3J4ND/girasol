// ---- Girasol principal (sprite) ----
const mainGlow = glowSprite(0xffc23a, 1); mainGlow.position.set(0, CY, 0);
const mainFlower = new THREE.Sprite(new THREE.SpriteMaterial({ map: headTex, transparent: true, depthWrite: false, opacity: 0 }));
mainFlower.position.set(0, CY, 0); mainFlower.renderOrder = 3; mainFlower.visible = false; scene.add(mainFlower);

// ---- Flores flotantes (girasoles, con tallo y ramos) ----
const flowers = [];
for (let i = 0; i < 18; i++) {
  const kind = i < 9 ? 0 : i < 14 ? 1 : 2;
  const tex = [headTex, stemTex, bouquetTex][kind];
  const size = kind === 0 ? .9 + R() * .7 : kind === 1 ? 1.7 + R() * .6 : 2.3 + R() * .6;
  const sx = kind === 0 ? size : kind === 1 ? size * .667 : size;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0 }));
  s.renderOrder = 3; s.visible = false; scene.add(s);
  const g = glowSprite(0xffc850, 2);
  const r = 3.4 + R() * 7.2;
  const y = kind === 0 ? 1.2 + R() * 5.2 : size * .5 + .2 + R() * .2;
  flowers.push({ s, g, sx, sy: size, glow: size * 1.9, r, a: R() * TAU, w: (R() < .5 ? -1 : 1) * (.05 + R() * .09), y, bs: .8 + R() * 1.2, ph: R() * TAU, delay: R() * 4.5 });
}
