# Arquitectura objetivo (pendiente de implementación y auditoría)

## Alcance
Aplicación web instalable sin tiendas; máximo 50 cuentas aprobadas; registros voluntarios de personas con consentimiento informado; sin imágenes de credenciales persistentes. Los datos de afinidad política son sensibles. La aplicación publicada en GitHub Pages es solamente un laboratorio público, no apto para producción.

## Separación de dominios
- **Público (GitHub Pages):** solo código y pruebas ficticias. Nunca alojar CURP, INE, domicilios, números, archivos de Drive, tokens ni datos de usuarios.
- **Capturista:** inicio de sesión frente a un servicio privado; acceso solo a lo necesario para capturar; no descarga masiva ni acceso directo a carpetas Drive.
- **Administrador:** aprobación de usuarios y dispositivos, revocación, revisión de incidentes, reportes agregados y exportaciones.
- **Servicio central:** valida permisos y duplicados, registra eventos append-only y sincroniza a Drive con identidad de servicio limitada.
- **Drive del responsable:** carpeta raíz privada, respaldos cifrados y archivos exportados por sección. Drive no es un motor de base de datos ni un servicio de autenticación.

## Cuentas
1. Invitación emitida por administrador (no registro público abierto).
2. Cada cuenta tiene UUID no reutilizable y estado pendiente/activo/suspendido/revocado.
3. Máximo 50 cuentas ACTIVAS validado de forma transaccional **en servidor**, no en el JavaScript cliente.
4. Credenciales con hash de contraseña Argon2id o proveedor de identidad equivalente, MFA preferible passkeys/TOTP y recuperación segura.
5. Roles: administrador, coordinador territorial, capturista, auditor de solo lectura.
6. Identidad del usuario confirmada por sesión verificable, nunca por un campo editable del formulario.
7. Auditoría con usuario, dispositivo autorizado, ID único de operación, tipo, marcas temporales de dispositivo y servidor, sección, resultado, razón, versión y registro afectado; sin exponer CURP en logs.

## Sin internet
- OCR y controles de calidad deben funcionar localmente si se aprueban por pruebas reales; no usar datos reales mientras no existan.
- Cola cifrada a nivel de aplicación con claves protegidas por el sistema cuando esté disponible. La caché HTTP del service worker NO sirve para guardar datos.
- Un registro offline es **provisional** hasta validación global. No se pueden detectar duplicados simultáneos entre teléfonos aislados.
- Eventos idempotentes con UUID y reintentos al abrir la app, volver la conectividad y pulsar sincronizar.
- El servidor aplica restricciones únicas para la CURP normalizada y deduplicación por UUID de operación en una transacción. No usar Sheets como índice único concurrente.
- Reconciliar conflictos; nunca sobrescribir silenciosamente ni declarar sincronizado sin acuse del servidor.
- Tras confirmar persistencia cifrada y respaldo, eliminar la copia local de manera verificable dentro de las limitaciones del dispositivo.

## Drive
Raíz conceptual: REGISTROS_JALPAN_DE_SERRA.
Secciones bajo revisión contra catálogo oficial: SECCION_0153 ... SECCION_0167.
Carpetas adicionales: AUDITORIA, RESPALDOS_CIFRADOS.
Archivo central de control y exportaciones agregadas por sección, preferentemente evitando CURP y domicilios en reportes generales.
Cada capturista NO recibe permisos directos a Drive.
Sheets/Excel son salidas de consulta, no autoridad transaccional. Los datos sensibles solo deben persistir cifrados según evaluación de riesgos.
El cifrado requiere gestión de claves separada del archivo; una carpeta 'privada' no equivale a cifrado de extremo a extremo.

## Captura documental
- Cámara en vivo, sin selector de galería.
- Calidad: brillo, reflejos, recorte, enfoque y lectura OCR de campos obligatorios; usar umbrales medidos con equipos reales.
- Document liveness para descartar pantallas/fotos es un objetivo todavía NO cumplido por el laboratorio ni por OpenCV/Tesseract por sí solos.
- Si faltan campos o el domicilio no está impreso, no fabricar datos. Definir procedimiento de excepción aprobado.
- Imagen descartada de memoria al concluir; verificar ausencia de imágenes en logs, cachés y respaldos. No se garantiza borrado físico de memoria flash.

## Consentimiento y legalidad
- Consentimiento específico y verificable, aviso de privacidad, finalidad determinada, plazos de retención, ARCO/revocación, control de acceso e incidentes.
- La INE original no prueba consentimiento. No inferir afiliación por la posesión de una credencial.
- Validación jurídica/fiscal independiente antes de la puesta en operación para actividades relacionadas con partido político.
- La aplicación no debe inferir ni predecir decisiones individuales de voto.

## Puertas de salida a producción
1. Motor OCR offline con prueba documentada en Android/iOS.
2. Validación externa de detección de reproducción (pantallas, impresiones) en condiciones de campo, con falsos positivos y negativos medidos.
3. Auditoría independiente del servidor, autenticación, controles de acceso y cifrado.
4. Pruebas de acceso cruzado, bloqueo de 51ª cuenta, duplicados simultáneos y recuperación de fallos con dispositivos desconectados.
5. Retención/eliminación y procedimientos de respuesta a incidentes.
6. Aprobación jurídica, operativa y de protección de datos.
Hasta entonces: prohibido registrar ciudadanos reales.
