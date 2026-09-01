const fs = require('fs');
const src = fs.readFileSync(__dirname + '/plantillas_core.js', 'utf8');
const mod = new Function(src + '\nreturn {TEMPLATES_NEGOCIOS,TEMPLATES_GESTORIAS,buildEmail,buildSes,plainText,skeleton};')();
const { TEMPLATES_NEGOCIOS: N, TEMPLATES_GESTORIAS: G, buildEmail, buildSes } = mod;

let fail = 0;
const bad = (m) => { console.log('  FALLO: ' + m); fail++; };

const OK_URLS = new Set([
  'https://factukey.com','https://factukey.com/verifactu/','https://factukey.com/facturacion-electronica/',
  'https://factukey.com/software-facturacion-asesorias/','https://factukey.com/facturas-recurrentes/',
  'https://factukey.com/presupuestos-online/','https://factukey.com/remesas-sepa/',
  'https://factukey.com/cobro-online-facturas/','https://factukey.com/cambiar-programa-facturacion/',
  'https://factukey.com/plantilla-factura-gratis','https://factukey.com/blog/','https://factukey.com/precios/',
  'https://factukey.com/funcionalidades/','https://factukey.com/contacto/','https://app.factukey.com/register',
]);

const REQ = ['subject','preheader','headline','intro','listTitle','bullets','highlightTitle','highlightText','cta','ctaUrl'];

function revisa(lista, nombre, tipo){
  console.log('== ' + nombre + ': ' + lista.length + ' plantillas');
  if (lista.length !== 20) bad(nombre + ' tiene ' + lista.length + ', esperaba 20');

  const subjects = new Set(), headlines = new Set();
  lista.forEach((v, i) => {
    REQ.forEach(k => { if (!v[k]) bad(`[${nombre} #${i}] falta el campo ${k}`); });
    if (v.subject && v.subject.length > 78) bad(`[${nombre} #${i}] asunto de ${v.subject.length} caracteres (max 78): ${v.subject}`);
    if (v.preheader && v.preheader.length > 130) bad(`[${nombre} #${i}] preheader demasiado largo (${v.preheader.length})`);
    if (subjects.has(v.subject)) bad(`[${nombre} #${i}] asunto repetido: ${v.subject}`);
    subjects.add(v.subject);
    if (headlines.has(v.headline)) bad(`[${nombre} #${i}] titular repetido: ${v.headline}`);
    headlines.add(v.headline);
    if (!Array.isArray(v.bullets) || v.bullets.length < 3) bad(`[${nombre} #${i}] necesita al menos 3 bullets`);
    (v.bullets||[]).forEach(b => { if (!b.t) bad(`[${nombre} #${i}] bullet sin titulo`); });
    if (!OK_URLS.has(v.ctaUrl)) bad(`[${nombre} #${i}] ctaUrl no verificada: ${v.ctaUrl}`);
  });

  // Ortografia: palabras que SIEMPRE llevan tilde/enie en castellano.
  // "cuanto"/"como"/"mas" NO llevan tilde cuando no son interrogativos, asi que
  // solo se listan palabras que la llevan SIEMPRE.
  const SIN_TILDE = /\b(facturacion|electronica|autonomo|autonomos|asesoria|asesorias|gestoria|gestorias|numeracion|informacion|tambien|estan|asi|dia|dias|comision|migracion|conversion|despues|ademas|aqui|alli|rapido|rapidos|rapida|facil|faciles|estandar|espana|senal|manana|nino|ano|anos|ultima|ultimo|unico|unica|numero|numeros|credito|debito|telefono|movil|tecnico|tecnicos|practico|automatico|automatica|electronico|deberia|podria|habria|quedaria|tendria)\b/i;
  lista.forEach((v, i) => {
    const texto = [v.subject, v.preheader, v.headline, v.intro, v.listTitle, v.highlightTitle, v.highlightText, v.cta]
      .concat((v.bullets||[]).map(b => b.t + ' ' + (b.d||''))).join(' | ');
    const m = texto.match(SIN_TILDE);
    if (m) bad(`[${nombre} #${i}] palabra sin tilde/enie: "${m[0]}"`);
    // Y al reves: cada plantilla tiene que llevar castellano acentuado de verdad.
    if (!/[áéíóúñÁÉÍÓÚÑ¿¡]/.test(texto)) bad(`[${nombre} #${i}] no lleva ni una tilde: parece texto ASCII`);
  });

  // Render completo del correo.
  lista.forEach((_, i) => {
    const row = { id: 1, uuid: 'uuid-de-prueba', correo: 'prueba@ejemplo.com' };
    if (tipo === 'gestorias') row.veces_enviado = i; else row.veces_enviado_factukey = i;
    const out = buildEmail(row, tipo);
    if (out.variante !== i) bad(`[${nombre}] veces_enviado=${i} deberia dar la plantilla ${i}, ha dado ${out.variante}`);
    if (out.subject !== lista[i].subject) bad(`[${nombre} #${i}] asunto del render no coincide`);
    const h = out.html;
    if (/undefined|\[object Object\]|\$\{/.test(h)) bad(`[${nombre} #${i}] el HTML tiene undefined o una plantilla sin resolver`);
    if (!h.includes('date de baja')) bad(`[${nombre} #${i}] falta el enlace de baja`);
    if (!h.includes('uuid-de-prueba')) bad(`[${nombre} #${i}] el enlace de baja no lleva el uuid`);
    if (!h.includes('B25995374')) bad(`[${nombre} #${i}] falta la identificacion LSSI (CIF)`);
    if (!h.includes(lista[i].ctaUrl)) bad(`[${nombre} #${i}] el CTA no apunta a ${lista[i].ctaUrl}`);
    const abre = (h.match(/<table/g)||[]).length, cierra = (h.match(/<\/table>/g)||[]).length;
    if (abre !== cierra) bad(`[${nombre} #${i}] tablas descuadradas: ${abre} abiertas, ${cierra} cerradas`);
    if (Buffer.byteLength(h) > 102400) bad(`[${nombre} #${i}] el HTML pesa mas de 100 KB (Gmail lo recorta)`);

    // Version en texto plano.
    const t = out.text;
    if (!t || t.length < 300) bad(`[${nombre} #${i}] la version en texto es demasiado corta`);
    if (/<[a-z/][^>]*>/i.test(t)) bad(`[${nombre} #${i}] han quedado etiquetas HTML en la version en texto`);
    if (/&[a-z]+;|&#\d+;/i.test(t)) bad(`[${nombre} #${i}] han quedado entidades HTML en la version en texto`);
    if (/undefined|\[object Object\]|\$\{/.test(t)) bad(`[${nombre} #${i}] la version en texto tiene undefined`);
    if (!t.includes(lista[i].ctaUrl)) bad(`[${nombre} #${i}] la version en texto no lleva el enlace del CTA`);
    if (!t.includes('B25995374')) bad(`[${nombre} #${i}] la version en texto no lleva la identificacion LSSI`);
    if (!t.includes(out.unsub)) bad(`[${nombre} #${i}] la version en texto no lleva el enlace de baja`);

    // Enlaces de baja: el visible es GET (pagina con boton), el de la cabecera es POST.
    if (!out.unsub.includes('uuid-de-prueba')) bad(`[${nombre} #${i}] el enlace de baja no lleva el uuid`);
    if (!out.unsubPost.includes('-baja?uuid=')) bad(`[${nombre} #${i}] falta el endpoint POST de baja en un clic`);
    if (out.unsubPost === out.unsub) bad(`[${nombre} #${i}] el enlace visible y el de un clic no pueden ser el mismo`);

    // Cuerpo de la llamada a SES.
    const p = buildSes(row, tipo).ses;
    if (p.Destination.ToAddresses[0] !== 'prueba@ejemplo.com') bad(`[${nombre} #${i}] destinatario mal en el cuerpo de SES`);
    if (!p.Content.Simple.Body.Text.Data || !p.Content.Simple.Body.Html.Data) bad(`[${nombre} #${i}] a SES le falta una de las dos versiones`);
    const cab = p.Content.Simple.Headers.map(x => x.Name).join(',');
    if (cab !== 'List-Unsubscribe,List-Unsubscribe-Post') bad(`[${nombre} #${i}] faltan las cabeceras de baja: ${cab}`);
    if (!/^<https:\/\/[^>]+-baja\?uuid=[^>]+>, <https:\/\/[^>]+>$/.test(p.Content.Simple.Headers[0].Value))
      bad(`[${nombre} #${i}] List-Unsubscribe mal formada: ${p.Content.Simple.Headers[0].Value}`);
    JSON.parse(JSON.stringify(p)); // tiene que ser JSON valido tal cual sale
  });

  // Vuelta completa: la plantilla 20 vuelve a la 0 (red de seguridad del modulo).
  const row = { uuid: 'x' };
  if (tipo === 'gestorias') row.veces_enviado = 20; else row.veces_enviado_factukey = 20;
  if (buildEmail(row, tipo).variante !== 0) bad(`[${nombre}] el modulo de seguridad no vuelve a la plantilla 0`);
}

revisa(N, 'NEGOCIOS', 'negocios');
revisa(G, 'GESTORIAS', 'gestorias');

// Ningun asunto puede coincidir entre las dos listas (un lead podria estar en ambas).
const cruce = N.map(v=>v.subject).filter(s => G.some(g=>g.subject===s));
if (cruce.length) bad('asuntos compartidos entre negocios y gestorias: ' + cruce.join(' / '));

// Tamano medio del correo
const medio = Math.round(N.concat(G).reduce((a,_,i)=>a+0,0));
const ej = buildEmail({uuid:'x', veces_enviado_factukey:0}, 'negocios').html;
console.log('\nTamano de un correo: ' + Math.round(Buffer.byteLength(ej)/1024*10)/10 + ' KB');
console.log(fail === 0 ? '\nTODO CORRECTO — 40 plantillas verificadas' : `\n${fail} FALLOS`);
process.exit(fail ? 1 : 0);
