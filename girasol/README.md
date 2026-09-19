# Girasol dorado 🌻 — animación 3D

Abre `index.html` en el navegador (necesita internet para Three.js y la tipografía).
Clic = reiniciar · mover el mouse = paralaje de cámara.

## Estructura
```
girasol-dorado/
├── index.html          Estructura: canvas WebGL + capa de mensajes + carga de scripts
├── css/
│   └── styles.css      Fondo, mensajes (aparecer/desaparecer con @keyframes) y brillo del texto
└── js/                 (se cargan en este orden)
    ├── utils.js        Helpers: clamp, easing, gauss
    ├── config.js       Línea de tiempo (T_HEART, T_BOOM2, LOOP...) y constantes
    ├── setup.js        Renderer, escena, cámara, uniforms compartidos, shader()
    ├── textures.js     Texturas por canvas: brillo, nebulosa, girasol, tallo, ramo
    ├── background.js   Nebulosa, estrellas titilantes, galaxia espiral
    ├── heart.js        Corazón paramétrico de partículas (explosión -> corazón)
    ├── explosion.js    Segunda explosión: chispas, destello, onda
    ├── flowers.js      Girasol principal y flores flotantes
    ├── effects.js      Corazoncitos y lluvia de meteoros
    ├── messages.js     Mensajes que orbitan (DOM + proyección 3D) y anillo guía
    └── main.js         Resize, cámara, bucle de animación
```

## Qué editar
- Tiempos: `js/config.js`
- Textos de los mensajes: `MSG` en `js/messages.js`
- Cantidad de flores / corazones / meteoros: `flowers.js` y `effects.js`
- Colores de la nebulosa: `nebs` en `js/background.js`
