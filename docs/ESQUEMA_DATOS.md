# Modelo conceptual de datos y flujo de auditoría

**No implementar con datos reales sin revisión legal, pruebas de seguridad y consentimiento expreso.**

## Usuarios (servidor privado)
- user_id: UUID
- full_name, verified_contact, role, assigned_sections
- status: pending | active | suspended | revoked
- registered_at, approved_by, approved_at, last_login_at
- credential_hash (nunca Excel), mfa_method
- enabled_devices (identificadores revocables)
- Restricción servidor: máximo 50 usuarios activos en una operación transaccional.

## Registros voluntarios (servidor, cifrado)
- record_id: UUID
- full_name, curp, phone, section_code, address_text
- consent_version, consent_timestamp, consent_evidence_reference
- created_by_user_id, created_at_device, accepted_at_server
- status: pending | accepted | duplicate | review | revoked
- unique global: normalized_curp; nunca una única regla por carpeta territorial
- request_id: UUID (idempotencia de reintentos offline)
- No almacenar fotos de INE por defecto.

## Auditoría append-only
- event_id, request_id, actor_user_id, device_id, record_id
- action, occurred_at_device, received_at_server
- outcome, reason_code, software_version, chain_integrity_reference
- No incluir documento o CURP íntegra en bitácoras ordinarias.
- Capturistas sin permisos para reescribir eventos.

## Secciones electorales
0153,0154,0155,0156,0157,0158,0159,0160,0161,0162,0163,0164,0165,0166,0167.
Confirmar vigencia territorial con el catálogo oficial en producción.

## Exportaciones
- Una carpeta por sección; reportes agregados y datos mínimos necesarios.
- CONTROL_GENERAL: sumatorias de registros aceptados, pendientes, duplicados y revocados.
- Copia exportable XLSX bajo control administrador.
- Nunca usar registros en CSV/XLSX como mecanismo único de exclusión mutua o autenticación.
