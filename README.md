# FactuKey — Campaña de correo a empresas y gestorías

40 plantillas de correo (20 para empresas y autónomos, 20 para gestorías y asesorías)
y los cambios aplicados a los workflows de envío de n8n.

**Ver las 40 plantillas:** https://anirudhatalmale6-alt.github.io/factukey-campana-email/

## Cómo funciona la secuencia

Cada destinatario recibe **una plantilla distinta en cada envío**, siempre en el mismo
orden. El índice sale de `veces_enviado` (gestorías) o `veces_enviado_factukey`
(empresas), así que nadie repite correo hasta agotar las 20.

Cadencia, según el número de envío que le toque a ese destinatario:

| Envíos | Cada |
|---|---|
| 1 – 4 | 3 días |
| 5 – 10 | 5 días |
| 11 – 20 | 7 días |
| 21 | se acabó: deja de escribírsele |

Son unos 4 meses de secuencia por destinatario.

## Entregabilidad (comprobada, no supuesta)

El envío va por **Amazon SES** (región us-east-1, cuenta con acceso de producción,
50.000 correos/día). Estado real del dominio `factukey.es` consultado en la API de SES:
identidad verificada, **DKIM propio activo** (3 CNAME publicados), MAIL FROM
`mail.factukey.es` correcto.

Prueba real de envío (mail-tester.com): **10/10**, con
`SPF pass`, `DKIM válido` y `DMARC pass` — importante porque el DMARC de
factukey.es está en `p=reject` con alineación estricta.

Cada correo sale con:

- versión en **texto plano + HTML** (multipart/alternative)
- cabeceras `List-Unsubscribe` y `List-Unsubscribe-Post: List-Unsubscribe=One-Click`
  (el botón "Cancelar suscripción" de Gmail/Outlook)
- identificación LSSI en el pie (razón social, CIF y dirección)

## Baja en dos pasos

El enlace del correo (GET) **ya no da de baja por sí solo**: abre una página con un
botón. La baja se ejecuta con el POST. Así los antivirus de correo, que abren todos
los enlaces de un mensaje para comprobarlos, ya no dan de baja contactos solos.

| Método | URL | Qué hace |
|---|---|---|
| GET | `/webhook/unsubscribe-factukey-negocios?uuid=…` | muestra la página con el botón |
| POST | `/webhook/unsubscribe-factukey-negocios-baja?uuid=…` | da de baja de verdad |

Lo mismo para `-gestorias` y para `unsubscribe-asesoria-lallave`. El enlace antiguo
sigue funcionando, así que ningún correo ya enviado se rompe. El POST es además el
endpoint de la baja en un clic de Gmail.

## Archivos

- `plantillas_core.js` — las 40 plantillas y el maquetado del correo. Es exactamente
  el código que corre en el nodo **Preparar Email HTML** de los dos workflows.
- `test_plantillas.js` — comprueba las 40: campos obligatorios, asuntos y titulares
  sin repetir, ortografía con tildes, enlaces verificados, identificación legal,
  enlace de baja y HTML bien cerrado. `node test_plantillas.js`
- `render.js` — genera los 40 correos en HTML dentro de `docs/`.
- `patch_envios.py` — aplica todo a n8n (workflows `3. Envio FactuKey - Gestorias`
  y `4. Envio FactuKey - Negocios`).
- `patch_bajas.py` — deja la baja en dos pasos en el workflow `Bajas (Unsubscribe)`.
- `docs/ejemplo-version-texto.txt` — cómo se ve la versión en texto plano.

## Añadir o cambiar una plantilla

1. Editar el array `TEMPLATES_NEGOCIOS` o `TEMPLATES_GESTORIAS` de `plantillas_core.js`.
2. `node test_plantillas.js` (tiene que decir TODO CORRECTO).
3. `python3 patch_envios.py`.

Si se añaden plantillas hay que subir también el tope `< 20` de la consulta SQL en
`patch_envios.py`, que es el que corta la secuencia.

## Estado

Los dos workflows de envío están **desactivados**. No se envía nada hasta que Carlos
dé el visto bueno.
