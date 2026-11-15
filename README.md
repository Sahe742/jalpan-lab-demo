# Jalpan Móvil V0.4 · Laboratorio de cámara

Esta versión es únicamente un laboratorio para cámara en vivo y detección preliminar de calidad visual con datos ficticios.

## Prohibido usar datos reales
No fotografiar INE, CURP, domicilios ni teléfonos. No hay OCR, detección validada de documento original, autenticación ni sincronización con Drive.

## Pruebas en el teléfono
1. Abrir la URL publicada con HTTPS en Chrome Android o Safari iPhone.
2. En **Cámara**, tocar **Activar cámara** y permitir el acceso.
3. Apuntar a una tarjeta ficticia impresa y tocar **Evaluar imagen**.
4. En **Diagnóstico**, tocar **Ejecutar prueba**.
5. Instalar desde el menú del navegador.
6. Tras cargar con internet, activar modo avión y comprobar apertura. No se garantiza sincronización en segundo plano en iPhone.

## Alcance
La cámara no permite seleccionar archivos de la galería, pero ello no prueba que el documento sea genuino. La prueba de nitidez usa umbrales experimentales; no comprueba legibilidad OCR. GitHub Pages es público: nunca guardar allí información personal, claves ni datos de ciudadanos.

## Archivos
index.html, app.js, sw.js, manifest.webmanifest, icon.svg, icon-192.png, icon-512.png.

## Infraestructura
Sin tienda de aplicaciones, sin backend ni base de datos. El repositorio público contiene solamente código de laboratorio.
