# JALPAN MÓVIL V0.5 · Laboratorio público

**Estado:** prototipo de cámara, evaluación experimental de calidad e interfaz simulada de usuarios y auditoría. **No es un sistema de registro en producción.**

## Acceso
GitHub Pages: https://sahe742.github.io/jalpan-lab-demo/

## Cambios V0.5
- Corrección de la prueba sintética de nitidez reportada como no concluyente en iPhone.
- Nueva pestaña de **Usuarios (demo)** con máximo de 50 cuentas como requisito documentado, no implementado.
- Bitácora completamente ficticia, sin almacenamiento.
- Versión de caché offline actualizada y comprobación de actualización al recuperar conexión.
- Documentos de arquitectura segura, flujo de datos, plan de pruebas y pendientes de producción.

## Lo confirmado y lo pendiente
Confirmado por capturas del usuario: HTTPS, acceso a cámara iPhone, procesamiento preliminar y service worker. La nueva prueba de nitidez V0.5 sigue pendiente de validación en teléfono.

No implementados: creación real de cuentas, contraseñas, MFA, OCR, detección auténtica de INE, base de datos, cifrado offline, sincronización con Drive, deduplicación global y consentimientos.

GitHub Pages es **público**. No enviar a este dominio fotografías de INE ni información identificable; tampoco subir tokens, claves API o archivos de Drive.

## Documentación
- [Arquitectura segura](docs/ARQUITECTURA_SEGURA.md)
- [Esquema de datos y auditoría](docs/ESQUEMA_DATOS.md)
- [Pruebas y resultados](docs/PRUEBAS_Y_RESULTADOS.md)

## Prueba en el teléfono
1. Abrir el sitio HTTPS, actualizar y confirmar V0.5.
2. Diagnóstico → Ejecutar prueba. Compartir solo el resultado numérico de nitidez, sin capturas de documentos.
3. Usuarios (demo) → verificar estructura ficticia.
4. Cámara → usar tarjeta inventada.
5. Instalación → Comprobar recursos offline. Abrir la app en modo avión si el navegador lo permite.

## Política de despliegue
No se habilitará ninguna captura de información personal real hasta implementar y validar la infraestructura privada, la autorización verificable de titulares, autenticación y restricciones de acceso, y auditoría independiente.
