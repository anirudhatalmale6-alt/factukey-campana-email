// Genera los 40 correos en HTML para revisarlos y para el repositorio.
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(__dirname + '/plantillas_core.js', 'utf8');
const { TEMPLATES_NEGOCIOS: N, TEMPLATES_GESTORIAS: G, buildEmail } =
  new Function(src + '\nreturn {TEMPLATES_NEGOCIOS,TEMPLATES_GESTORIAS,buildEmail};')();

const OUT = path.join(__dirname, 'salida');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'empresas'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'gestorias'), { recursive: true });

const filas = [];
function genera(lista, tipo, carpeta, etiqueta) {
  lista.forEach((v, i) => {
    const row = { id: 1, uuid: 'ejemplo-uuid', correo: 'ejemplo@empresa.es' };
    if (tipo === 'gestorias') row.veces_enviado = i; else row.veces_enviado_factukey = i;
    const out = buildEmail(row, tipo);
    const nombre = String(i + 1).padStart(2, '0') + '.html';
    fs.writeFileSync(path.join(OUT, carpeta, nombre), out.html);
    filas.push({ etiqueta, n: i + 1, subject: v.subject, cta: v.ctaUrl, file: carpeta + '/' + nombre });
  });
}
genera(N, 'negocios', 'empresas', 'Empresas y autónomos');
genera(G, 'gestorias', 'gestorias', 'Gestorías y asesorías');

// Indice para abrirlo todo de un vistazo
const grupos = ['Empresas y autónomos', 'Gestorías y asesorías'].map(g => `
  <h2>${g}</h2>
  <ol>${filas.filter(f => f.etiqueta === g).map(f =>
    `<li><a href="${f.file}" target="_blank">${f.subject}</a><br><small>${f.cta}</small></li>`).join('')}</ol>`).join('');

fs.writeFileSync(path.join(OUT, 'index.html'), `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<title>FactuKey — 40 plantillas de correo</title>
<style>body{font-family:'Segoe UI',Arial,sans-serif;background:#eef1f6;color:#0B2447;margin:0;padding:32px}
.c{max-width:860px;margin:0 auto;background:#fff;border-radius:14px;padding:28px 36px;box-shadow:0 6px 24px rgba(11,36,71,.12)}
h1{margin:0 0 4px}h2{margin:28px 0 8px;border-bottom:2px solid #00B4D8;padding-bottom:6px}
ol{padding-left:22px}li{margin:10px 0;line-height:1.5}a{color:#0B2447}small{color:#8a92a0}</style></head>
<body><div class="c"><h1>FactuKey — 40 plantillas de correo</h1>
<p>Cada destinatario recibe una plantilla distinta en cada envío, en este orden. Al llegar a la 20 la secuencia se agota y deja de escribírsele.</p>
${grupos}</div></body></html>`);

// Texto plano para revisar los asuntos de un vistazo
fs.writeFileSync(path.join(OUT, 'asuntos.txt'), filas.map(f =>
  `${f.etiqueta} · ${String(f.n).padStart(2, '0')} · ${f.subject}`).join('\n') + '\n');

console.log('Generados ' + filas.length + ' correos en ' + OUT);
