#!/usr/bin/env python3
"""Actualiza los dos workflows de envio de FactuKey en n8n.

- Mete las 40 plantillas nuevas en "Preparar Email HTML".
- Cambia la cadencia a 3 / 5 / 7 dias segun el numero de envio.
- Conecta el disparador diario (estaba suelto en los dos).
- Quita la dependencia de la campana de Asesoria La Llave en el de negocios.
- Pone la zona horaria Europe/Madrid.
Los workflows siguen DESACTIVADOS: solo se activan cuando Carlos lo diga.
"""
import io, json, os, subprocess, sys

BASE = 'https://n8n.digitalnexo.es'
HERE = os.path.dirname(os.path.abspath(__file__))
COOKIES = os.path.join(HERE, 'cookies.txt')

CORE = io.open(os.path.join(HERE, 'plantillas_core.js'), encoding='utf-8').read()

WRAPPER = """
// --- n8n wrapper (%(tipo)s) ---
const row = $json;
const out = buildSes(row, '%(tipo)s');
out.id = row.id;
out.uuid = row.uuid;
out.web = row.web;
return [{ json: out }];
"""

# El nodo awsSes de n8n solo manda HTML y no deja poner cabeceras propias.
# Se sustituye por una llamada directa a la API de Amazon SES (v2 SendEmail)
# firmada con la MISMA credencial de AWS, que si admite las dos versiones del
# correo (texto + HTML) y las cabeceras List-Unsubscribe.
CRED_AWS = {'aws': {'id': 'Du0M9XTcZskExTjN', 'name': 'AWS (IAM) account'}}
SES_URL = 'https://email.us-east-1.amazonaws.com/v2/email/outbound-emails'

# Escalera de cadencia: los primeros correos van mas seguidos y luego se espacian.
CADENCIA = """  AND (
    %(fecha)s IS NULL
    OR (COALESCE(%(veces)s,0) < 4  AND %(fecha)s < NOW() - INTERVAL '3 days')
    OR (COALESCE(%(veces)s,0) BETWEEN 4 AND 9 AND %(fecha)s < NOW() - INTERVAL '5 days')
    OR (COALESCE(%(veces)s,0) >= 10 AND %(fecha)s < NOW() - INTERVAL '7 days')
  )
  AND COALESCE(%(veces)s,0) < 20"""

SQL_GES = """-- Gestorias pendientes de recibir el siguiente correo de la secuencia.
-- Cadencia: envios 1-4 cada 3 dias, 5-10 cada 5 dias, 11-20 cada 7 dias.
-- Al llegar a 20 envios la secuencia se agota y el lead deja de salir.
SELECT * FROM leads
WHERE correo IS NOT NULL AND correo <> ''
  AND estado NOT IN ('Cancelado','Duplicado','Sin correo')
""" + CADENCIA % {'fecha': 'fecha_envio', 'veces': 'veces_enviado'} + """
ORDER BY fecha_envio ASC NULLS FIRST, id ASC
LIMIT 60;"""

SQL_NEG = """-- Empresas pendientes de recibir el siguiente correo de la secuencia.
-- Cadencia: envios 1-4 cada 3 dias, 5-10 cada 5 dias, 11-20 cada 7 dias.
-- Al llegar a 20 envios la secuencia se agota y el lead deja de salir.
-- OJO: antes esta consulta exigia fecha_envio_gestoria IS NOT NULL, es decir,
-- solo escribia a quien ya habia recibido el correo de Asesoria La Llave. Como
-- esa campana nunca se ha lanzado, no habia ni un solo destinatario.
SELECT * FROM leads_negocios
WHERE correo IS NOT NULL AND correo <> ''
  AND estado NOT IN ('Cancelado','Duplicado','Sin correo')
""" + CADENCIA % {'fecha': 'fecha_envio_factukey', 'veces': 'veces_enviado_factukey'} + """
ORDER BY fecha_envio_factukey ASC NULLS FIRST, id ASC
LIMIT 100;"""

PLAN = {
    'yLponvJMGzW9bQ78': {
        'tipo': 'gestorias',
        'sql': SQL_GES,
        'trigger': 'Envio Diario 11AM',
        'hora': 10,
        'espera': 30,
    },
    '4xUZ431P9MW7LwDm': {
        'tipo': 'negocios',
        'sql': SQL_NEG,
        'trigger': 'Envio Diario 11AM',
        'hora': 12,
        'espera': 30,
    },
}


def curl(args):
    out = subprocess.run(['curl', '-4', '-s', '-b', COOKIES] + args,
                         capture_output=True, text=True)
    if out.returncode != 0:
        raise RuntimeError('curl fallo: ' + out.stderr)
    return out.stdout


def get_wf(wid):
    return json.loads(curl(['%s/rest/workflows/%s' % (BASE, wid)]))['data']


def patch_wf(wid, body):
    tmp = os.path.join(HERE, '_body_%s.json' % wid)
    io.open(tmp, 'w', encoding='utf-8').write(json.dumps(body, ensure_ascii=False))
    r = curl(['-X', 'PATCH', '%s/rest/workflows/%s' % (BASE, wid),
              '-H', 'Content-Type: application/json', '--data-binary', '@' + tmp])
    os.remove(tmp)
    return json.loads(r)


def node(wf, name):
    for n in wf['nodes']:
        if n['name'] == name:
            return n
    raise KeyError('no encuentro el nodo ' + name + ' en ' + wf['name'])


for wid, cfg in PLAN.items():
    wf = get_wf(wid)
    print('=' * 64)
    print(wf['name'], '(activo =', wf.get('active'), ')')

    # copia de seguridad antes de tocar nada
    io.open(os.path.join(HERE, 'backup_%s.json' % wid), 'w', encoding='utf-8').write(
        json.dumps(wf, ensure_ascii=False, indent=1))

    # 1) plantillas
    n = node(wf, 'Preparar Email HTML')
    n['parameters']['jsCode'] = CORE + WRAPPER % {'tipo': cfg['tipo']}
    print('  plantillas: 40 (20 negocios + 20 gestorias), se usa la lista de', cfg['tipo'])

    # 2) consulta con la escalera de cadencia
    n = node(wf, 'Leer Pendientes')
    n['parameters']['query'] = cfg['sql']
    print('  consulta: cadencia 3/5/7 dias, tope de 20 correos por lead')

    # 3) disparador: quitar el triggerAtHour suelto y dejar solo la regla diaria
    n = node(wf, cfg['trigger'])
    n['parameters'] = {'rule': {'interval': [{'field': 'days', 'triggerAtHour': cfg['hora']}]}}
    print('  disparador: todos los dias a las %02d:00 (hora espanola)' % cfg['hora'])

    # 4) el disparador estaba suelto: conectarlo a Leer Pendientes
    conns = wf['connections']
    if cfg['trigger'] not in conns:
        conns[cfg['trigger']] = {'main': [[{'node': 'Leer Pendientes', 'type': 'main', 'index': 0}]]}
        print('  ARREGLADO: el disparador no estaba conectado a nada')

    # 4bis) el envio pasa por la API de SES: texto + HTML + cabeceras de baja
    n = node(wf, 'Enviar Email')
    n['type'] = 'n8n-nodes-base.httpRequest'
    n['typeVersion'] = 4.2
    n['parameters'] = {
        'method': 'POST',
        'url': SES_URL,
        'authentication': 'predefinedCredentialType',
        'nodeCredentialType': 'aws',
        'sendBody': True,
        'specifyBody': 'json',
        'jsonBody': '={{ JSON.stringify($json.ses) }}',
        'options': {},
    }
    n['credentials'] = CRED_AWS
    # Si un correo concreto lo rechaza SES (direccion mal formada, etc.) el lote
    # del dia debe seguir con los demas, no cortarse en seco.
    n['onError'] = 'continueRegularOutput'
    print('  envio: SES v2 con version en texto + List-Unsubscribe (un clic)')

    # 5) espera entre correos
    n = node(wf, 'Esperar')
    n['parameters'] = {'amount': cfg['espera'], 'unit': 'seconds'}
    print('  espera entre correos: %ds' % cfg['espera'])

    # 6) zona horaria (por defecto la instancia esta en Nueva York)
    st = wf.get('settings') or {}
    st['timezone'] = 'Europe/Madrid'
    wf['settings'] = st

    body = {
        'name': wf['name'],
        'nodes': wf['nodes'],
        'connections': conns,
        'settings': st,
    }
    res = patch_wf(wid, body)
    ok = 'data' in res
    print('  PATCH:', 'OK' if ok else res)
    if not ok:
        sys.exit(1)

print('\nHecho. Los dos siguen DESACTIVADOS.')
