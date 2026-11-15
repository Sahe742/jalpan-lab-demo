# Evidencia y estado de pruebas (15 noviembre 2026)

## Probado por el usuario en iPhone
- GitHub Pages accesible por HTTPS: confirmado mediante capturas.
- Cámara trasera del iPhone: captura en vivo habilitada.
- Evaluación de calidad: ejecuta y reporta métricas; en una escena reportó contraste 23.8 y nitidez 3.5, calidad insuficiente o incierta.
- Service worker disponible; interfaz mostró siete recursos cacheados.
- **No se confirmó todavía apertura en modo avión** ni instalación como PWA independiente.
- Auto-prueba de desenfoque V0.4: ambos valores 21.16, NO CONCLUYENTE.

## Corrección en V0.5
- La prueba V0.4 dibujaba la imagen con filtro de desenfoque en el mismo canvas de origen.
- V0.5 separa un canvas de origen y otro de salida. Esto corrige la metodología y requiere volver a ejecutar la prueba en iPhone.
- Ningún resultado de V0.5 debe declararse aprobado antes de comprobarlo en el teléfono del usuario.

## Pruebas pendientes
- OCR real offline: no implementado.
- Rechazo de fotografía o pantalla de otro celular: no implementado.
- Datos cifrados offline: no implementado.
- Usuarios, contraseñas, MFA: solo simulación visual, sin servicio.
- Sincronización, deduplicación global y Drive: no implementados.
- Análisis de seguridad independiente: no realizado.

## Prueba de laboratorio V0.5
1. Actualizar página y verificar que aparezca V0.5.
2. Diagnóstico > Ejecutar prueba; enviar valores de nitidez definida y suavizada. PASS no implica autenticidad ni OCR.
3. Usuarios (demo) > confirmar que son ejemplos ficticios, sin formulario de contraseñas.
4. Cámara > probar con tarjeta sin datos personales.
5. Instalación > Comprobar recursos offline; activar modo avión, reabrir y verificar interfaz.
