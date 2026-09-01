"""Opcion B: la baja deja de ser un GET que modifica la base de datos.

GET  /webhook/unsubscribe-...            -> pagina con boton (NO toca nada)
POST /webhook/unsubscribe-...-baja       -> da de baja de verdad

El enlace antiguo sigue funcionando (mismo path GET), asi que ningun correo
ya enviado se rompe. El POST sirve ademas como endpoint de List-Unsubscribe
One-Click (Gmail/Yahoo envian POST a esa URL con el uuid en la query).
"""
import json, subprocess

BASE = 'https://n8n.digitalnexo.es'
CK = 'ck.txt'
WID = '9t1MC4ZpKjoaHYem'


def curl(method, path, body=None):
    cmd = ['curl', '-4', '-s', '-b', CK, '-X', method, BASE + path]
    if body is not None:
        cmd += ['-H', 'Content-Type: application/json', '-d', json.dumps(body)]
    out = subprocess.run(cmd, capture_output=True, text=True).stdout
    try:
        return json.loads(out)
    except Exception:
        return {'_raw': out[:1500]}


CAB = ('<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">'
       '<meta name="viewport" content="width=device-width,initial-scale=1"><title>%s</title></head>'
       '<body style="margin:0;font-family:Segoe UI,Arial,sans-serif;background:#eef1f6;">'
       '<table width="100%%" cellpadding="0" cellspacing="0" style="padding:60px 16px;"><tr><td align="center">'
       '<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%%;background:#fff;'
       'border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(11,36,71,.12);">'
       '<tr><td style="background:%s;padding:26px 40px;text-align:center;">'
       '<img src="%s" width="170" alt="%s" style="display:block;margin:0 auto;width:170px;height:auto;"></td></tr>'
       '<tr><td style="height:4px;background:%s;font-size:4px;">&nbsp;</td></tr>')

PIE = ('<tr><td align="center" style="padding:20px 44px 34px;">'
       '<p style="margin:0;font-size:12px;color:#aab0bd;">%s</p></td></tr>'
       '</table></td></tr></table></body></html>')

FK_LOGO = 'https://factukey.com/wp-content/uploads/factukey-logo-white.png'


def pagina_confirmar(titulo, marca, logo, navy, color, pie, accion, texto):
    """Pagina con boton. El uuid viaja en un campo oculto del formulario."""
    return ('=' + (CAB % (titulo, navy, logo, marca, color)) +
            '<tr><td align="center" style="padding:30px 44px 4px;">'
            '<h1 style="margin:0 0 10px;font-size:22px;color:#0B2447;">' + titulo + '</h1>'
            '<p style="margin:0 0 6px;font-size:14px;color:#5b6472;line-height:1.7;">' + texto + '</p></td></tr>'
            '<tr><td align="center" style="padding:22px 44px 30px;">'
            '<form method="POST" action="' + accion + '?uuid={{ $json.query.uuid }}">'
            '<input type="hidden" name="uuid" value="{{ $json.query.uuid }}">'
            '<button type="submit" style="background:' + color + ';color:#fff;border:0;border-radius:8px;'
            'padding:14px 30px;font-size:15px;font-weight:600;cursor:pointer;">Confirmar la baja</button>'
            '</form>'
            '<p style="margin:16px 0 0;font-size:12px;color:#aab0bd;">Si has llegado aquí por error, cierra esta página y no pasará nada.</p>'
            '</td></tr>' + (PIE % pie))


def pagina_hecha(titulo, marca, logo, navy, color, pie, texto):
    return ('=' + (CAB % (titulo, navy, logo, marca, color)) +
            '<tr><td align="center" style="padding:26px 44px 6px;">'
            '<div style="width:54px;height:54px;border-radius:50%;background:#e8f9fd;color:' + color +
            ';font-size:30px;line-height:54px;">&#10003;</div></td></tr>'
            '<tr><td align="center" style="padding:8px 44px 0;">'
            '<h1 style="margin:0 0 10px;font-size:22px;color:#0B2447;">' + titulo + '</h1>'
            '<p style="margin:0 0 6px;font-size:14px;color:#5b6472;line-height:1.7;">' + texto + '</p></td></tr>' +
            (PIE % pie))


# marca, logo, navy, color, pie
FK = ('FactuKey', FK_LOGO, '#0B2447', '#00B4D8', 'FactuKey &middot; Future Times Business S.L.')

CANALES = [
    # (webhook GET, nodo update, nodo pagina, path GET, tabla, marca)
    ('Webhook FKneg', 'Baja FKneg', 'Pagina FKneg', 'unsubscribe-factukey-negocios', 'leads_negocios', FK),
    ('Webhook FKges', 'Baja FKges', 'Pagina FKges', 'unsubscribe-factukey-gestorias', 'leads', FK),
    ('Webhook Baja', 'Marcar Baja', 'Pagina Baja', 'unsubscribe-asesoria-lallave', 'leads_negocios', FK),
]

wf = curl('GET', '/rest/workflows/' + WID)['data']
open('backup_bajas.json', 'w').write(json.dumps(wf))
nodes = {n['name']: n for n in wf['nodes']}
conns = wf['connections']

y = 0
for wh, upd, pag, path, tabla, (marca, logo, navy, color, pie) in CANALES:
    if wh not in nodes:
        print('FALTA', wh)
        continue
    accion = BASE + '/webhook/' + path + '-baja'

    # 1) el GET ya no toca la base de datos: responde la pagina con el boton
    nodes[pag]['parameters']['responseBody'] = pagina_confirmar(
        'Darte de baja de los correos de ' + marca, marca, logo, navy, color, pie, accion,
        'Pulsa el botón para dejar de recibir nuestros correos. No te volveremos a escribir.')
    conns[wh] = {"main": [[{"node": pag, "type": "main", "index": 0}]]}

    # 2) nuevo POST que hace la baja de verdad
    wh_post = wh + ' POST'
    pag_post = pag + ' OK'
    base_y = 520 + y
    nodes[wh_post] = {
        "parameters": {"httpMethod": "POST", "path": path + '-baja',
                       "responseMode": "responseNode", "options": {}},
        "type": "n8n-nodes-base.webhook", "typeVersion": 2,
        "position": [-40, base_y], "id": wh_post.lower().replace(' ', '-'), "name": wh_post,
        "webhookId": path + '-baja',
    }
    nodes[upd]['position'] = [200, base_y]
    nodes[upd]['parameters']['query'] = ("UPDATE %s SET estado='Cancelado', fecha_baja=NOW() "
                                         "WHERE uuid = $1;" % tabla)
    nodes[upd]['parameters']['options']['queryReplacement'] = \
        "={{ $json.body && $json.body.uuid ? $json.body.uuid : $json.query.uuid }}"
    nodes[pag_post] = {
        "parameters": {"respondWith": "text",
                       "responseBody": pagina_hecha('Te has dado de baja correctamente', marca, logo,
                                                    navy, color, pie,
                                                    'Hemos eliminado tu correo de nuestra lista y no volveremos a escribirte. Disculpa las molestias.')},
        "type": "n8n-nodes-base.respondToWebhook", "typeVersion": 1.1,
        "position": [420, base_y], "id": pag_post.lower().replace(' ', '-'), "name": pag_post,
    }
    conns[wh_post] = {"main": [[{"node": upd, "type": "main", "index": 0}]]}
    conns[upd] = {"main": [[{"node": pag_post, "type": "main", "index": 0},
                            {"node": "Avisar Baja Discord", "type": "main", "index": 0}]]}
    y += 220

payload = {"name": wf['name'], "nodes": list(nodes.values()), "connections": conns,
           "settings": wf.get('settings', {})}
r = curl('PATCH', '/rest/workflows/' + WID, payload)
print('patch', 'ok' if r.get('data') else json.dumps(r)[:600])

# el workflow esta ACTIVO: hay que republicar la version para que los webhooks nuevos existan
v = curl('GET', '/rest/workflows/' + WID)['data']
curl('POST', '/rest/workflows/%s/deactivate' % WID, {})
curl('POST', '/rest/workflows/%s/activate' % WID, {"versionId": v['versionId']})
v2 = curl('GET', '/rest/workflows/' + WID)['data']
print('active', v2['active'], 'version ok', v2['versionId'] == v2.get('activeVersionId'))
