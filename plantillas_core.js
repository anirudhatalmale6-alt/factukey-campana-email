// FactuKey - generador de correos comerciales (secuencia rotativa)
// tipo 'gestorias' (tabla leads) o 'negocios' (tabla leads_negocios).
// Marca: navy #0B2447 + turquesa #00B4D8. Logo blanco sobre cabecera navy.
// Identidad LSSI: Future Times Business S.L. - CIF B25995374 - Calle Valparaiso 2, Fuenlabrada (Madrid)
//
// 20 plantillas para negocios + 20 para gestorias. Cada envio a un mismo lead
// usa la SIGUIENTE plantilla de la lista (indice = veces_enviado), no un modulo,
// asi ninguna se repite hasta agotar la secuencia. Cuando se agota, la SQL de
// "Leer Pendientes" deja de seleccionar ese lead.

const LOGO = 'https://factukey.com/wp-content/uploads/factukey-logo-white.png';
const WEB  = 'https://factukey.com';
const APP  = 'https://app.factukey.com/register';
const EMPRESA = 'Future Times Business S.L.';
const CIF = 'B25995374';
const DIR = 'Calle Valparaíso 2, 28944 Fuenlabrada (Madrid)';

const NAVY = '#0B2447';
const TURQ = '#00B4D8';

function skeleton(v, unsub){
  const ctaUrl = v.ctaUrl || WEB;
  const bullets = v.bullets.map(b =>
    `<tr><td valign="top" style="padding:6px 0;width:26px;color:${TURQ};font-size:16px;line-height:1.5;">&#10003;</td>
     <td style="padding:6px 0;font-size:14px;color:#3d4453;line-height:1.6;"><b style="color:${NAVY};">${b.t}</b>${b.d?` &mdash; ${b.d}`:''}</td></tr>`
  ).join('');

  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:#eef1f6;font-family:'Segoe UI',Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${v.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f6;padding:26px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(11,36,71,.12);">

  <tr><td style="background:${NAVY};padding:26px 40px 22px;text-align:center;">
    <img src="${LOGO}" alt="FactuKey" width="178" style="display:block;margin:0 auto;width:178px;max-width:58%;height:auto;">
    <p style="margin:12px 0 0;font-size:12px;letter-spacing:1px;color:${TURQ};text-transform:uppercase;">Facturación adaptada a VeriFactu</p>
  </td></tr>
  <tr><td style="height:4px;background:${TURQ};line-height:4px;font-size:4px;">&nbsp;</td></tr>

  <tr><td style="padding:24px 44px 0;">
    <h1 style="margin:0 0 14px;font-size:22px;line-height:1.3;color:${NAVY};">${v.headline}</h1>
    <p style="margin:0 0 14px;font-size:14px;color:#3d4453;line-height:1.75;">${v.intro}</p>
  </td></tr>

  <tr><td style="padding:6px 44px 0;">
    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:${NAVY};text-transform:uppercase;letter-spacing:.4px;">${v.listTitle}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${bullets}</table>
  </td></tr>

  <tr><td style="padding:20px 44px 4px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e8f9fd;border-left:4px solid ${TURQ};border-radius:8px;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:${NAVY};">${v.highlightTitle}</p>
        <p style="margin:0;font-size:13px;color:#1c5f70;line-height:1.6;">${v.highlightText}</p>
      </td></tr>
    </table>
  </td></tr>

  <tr><td align="center" style="padding:24px 44px 6px;">
    <a href="${ctaUrl}" style="display:inline-block;background:${TURQ};color:${NAVY};font-size:15px;font-weight:700;padding:14px 42px;border-radius:8px;text-decoration:none;">${v.cta}</a>
  </td></tr>
  <tr><td align="center" style="padding:0 44px 8px;">
    <p style="margin:8px 0 0;font-size:13px;color:#5b6472;line-height:1.6;">O respóndenos a este correo y te lo contamos sin compromiso.</p>
  </td></tr>

  <tr><td style="padding:8px 44px 0;"><hr style="border:none;border-top:1px solid #e7eaf0;margin:0;"></td></tr>
  <tr><td style="background:#ffffff;padding:16px 44px 24px;text-align:center;">
    <p style="margin:0 0 4px;font-size:13px;color:#8a92a0;line-height:1.6;"><b style="color:${NAVY};">FactuKey</b> &middot; <a href="${WEB}" style="color:${TURQ};text-decoration:none;">factukey.com</a></p>
    <p style="margin:6px 0 0;font-size:11px;color:#aab0bd;line-height:1.6;">Síguenos en Instagram: <a href="https://instagram.com/factukey" style="color:${TURQ};text-decoration:none;">@factukey</a></p>
    <p style="margin:8px 0 0;font-size:11px;color:#aab0bd;line-height:1.6;">${EMPRESA} &middot; CIF ${CIF} &middot; ${DIR}</p>
    <p style="margin:8px 0 0;font-size:11px;color:#aab0bd;line-height:1.6;">Recibes este correo como comunicación comercial dirigida a empresas, autónomos y profesionales. Si no deseas recibir más, <a href="${unsub}" style="color:#8a92a0;text-decoration:underline;">date de baja aquí</a> y no volveremos a escribirte.</p>
  </td></tr>

</table>
</td></tr></table></body></html>`;
}

// Versión en texto plano. Va SIEMPRE junto a la HTML (multipart/alternative):
// un correo comercial solo-HTML puntúa peor en los filtros y algunos clientes
// de correo no muestran nada.
function limpia(s){
  return String(s || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&middot;/g, '·').replace(/&mdash;/g, '—').replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function plainText(v, unsub){
  const ctaUrl = v.ctaUrl || WEB;
  const lineas = [
    limpia(v.headline),
    '',
    limpia(v.intro),
    '',
    limpia(v.listTitle).toUpperCase(),
  ];
  v.bullets.forEach(b => lineas.push('- ' + limpia(b.t) + (b.d ? ': ' + limpia(b.d) : '')));
  lineas.push('', limpia(v.highlightTitle), limpia(v.highlightText), '',
    limpia(v.cta) + ': ' + ctaUrl,
    '',
    'O responde a este correo y te lo contamos sin compromiso.',
    '',
    '---',
    'FactuKey · ' + WEB + ' · Instagram: @factukey',
    EMPRESA + ' · CIF ' + CIF + ' · ' + DIR,
    'Recibes este correo como comunicación comercial dirigida a empresas, autónomos y profesionales.',
    'Para no recibir más: ' + unsub);
  return lineas.join('\n');
}

// ─────────────────────────────────────────────────────────────────────
// 20 plantillas — EMPRESAS, AUTÓNOMOS Y PROFESIONALES
// Una por funcionalidad real de FactuKey. Orden = orden de envío.
// ─────────────────────────────────────────────────────────────────────
const TEMPLATES_NEGOCIOS = [
  {
    subject: 'Facturación electrónica sencilla para tu negocio',
    preheader: 'Crea facturas en segundos y cumple con la normativa. Sin instalar nada.',
    headline: 'Tu facturación, sencilla y adaptada a VeriFactu',
    intro: '<b>FactuKey</b> es el programa de facturación pensado para negocios como el tuyo. Crea facturas y presupuestos en segundos, lleva el control de tus clientes y cumple con la normativa vigente, todo desde el móvil o el ordenador.',
    listTitle: 'Qué puedes hacer con FactuKey',
    bullets: [
      {t:'Facturas y presupuestos', d:'en segundos y con tu imagen de marca'},
      {t:'Adaptado a VeriFactu', d:'preparado para la normativa vigente'},
      {t:'Control de clientes e ingresos', d:'todo ordenado y a un clic'},
      {t:'Desde cualquier dispositivo', d:'sin instalar nada, siempre a mano'},
    ],
    highlightTitle: '14 días de prueba, sin tarjeta',
    highlightText: 'Regístrate y crea tu primera factura en minutos. No pedimos tarjeta de crédito para probarlo.',
    cta: 'Empezar ahora',
    ctaUrl: APP,
  },
  {
    subject: '¿Autónomo? Haz tus facturas en segundos y cumple con VeriFactu',
    preheader: 'Menos papeleo, más tiempo para lo tuyo. FactuKey lo pone fácil.',
    headline: '¿Autónomo? Deja atrás el Excel y las facturas a mano',
    intro: 'Si eres autónomo, <b>FactuKey</b> te quita de encima el lío de las facturas. Créalas en segundos, envíalas al momento y ten siempre a mano lo que has facturado, con todo preparado para <b>VeriFactu</b> y la normativa vigente.',
    listTitle: 'Pensado para autónomos',
    bullets: [
      {t:'Facturas en segundos', d:'plantillas listas, solo rellenas y envías'},
      {t:'Control de lo que facturas', d:'sabes en todo momento cómo vas'},
      {t:'Adaptado a VeriFactu', d:'tranquilidad con la normativa'},
      {t:'Fácil de verdad', d:'sin conocimientos técnicos'},
    ],
    highlightTitle: 'Pruébalo tú mismo',
    highlightText: 'En menos de lo que tardas en hacer una factura a mano, la tienes hecha con FactuKey.',
    cta: 'Quiero probarlo',
    ctaUrl: APP,
  },
  {
    subject: 'Cobra tus facturas con tarjeta o Bizum, sin comisiones nuestras',
    preheader: 'Tus clientes pagan desde la propia factura y el dinero va directo a tu banco.',
    headline: 'Que tus clientes puedan pagarte al momento',
    intro: 'Con el <b>cobro online</b> de FactuKey tus facturas llevan un botón de pago: tu cliente paga con <b>tarjeta o Bizum</b> desde la propia factura y el dinero va <b>directo a tu cuenta bancaria</b>. Nosotros no retenemos el dinero ni te cobramos comisión por ello.',
    listTitle: 'Cómo funciona',
    bullets: [
      {t:'Botón de pago en la factura', d:'tarjeta o Bizum, sin registros raros'},
      {t:'El dinero va a tu banco', d:'FactuKey no lo retiene en ningún momento'},
      {t:'La factura se marca pagada sola', d:'sin que tengas que revisar nada'},
      {t:'Menos impagados', d:'cuanto más fácil es pagar, antes te pagan'},
    ],
    highlightTitle: 'Cobrar antes cambia el mes',
    highlightText: 'La mayoría de retrasos no son por falta de dinero, son por pereza. Poner un botón lo arregla.',
    cta: 'Ver cómo funciona',
    ctaUrl: WEB + '/cobro-online-facturas/',
  },
  {
    subject: 'Deja de perseguir a los clientes que no pagan',
    preheader: 'FactuKey reclama los impagados por ti, con recordatorios automáticos.',
    headline: 'Los recordatorios de cobro, en automático',
    intro: 'Perseguir un impagado es de las cosas más incómodas del negocio. <b>FactuKey</b> lo hace por ti: define cada cuántos días quieres avisar y el sistema envía el recordatorio al cliente, con la factura y el enlace de pago, hasta que la cobras.',
    listTitle: 'Lo que hace por ti',
    bullets: [
      {t:'Recordatorios automáticos', d:'tú decides los días y el tono'},
      {t:'Con enlace de pago', d:'el cliente paga desde el propio aviso'},
      {t:'Panel de impagados', d:'ves de un vistazo quién te debe y cuánto'},
      {t:'Se paran solos al cobrar', d:'nunca reclamas una factura ya pagada'},
    ],
    highlightTitle: 'Sin conversaciones incómodas',
    highlightText: 'El aviso lo manda el programa. Tú te quedas con la buena relación con el cliente.',
    cta: 'Quiero verlo',
    ctaUrl: WEB + '/cobro-online-facturas/',
  },
  {
    subject: 'Cambiar de programa de facturación ya no es un problema',
    preheader: 'Traes tus clientes y productos desde Excel o tu programa actual, en minutos.',
    headline: 'Cámbiate a FactuKey sin perder tus datos',
    intro: 'La excusa de siempre para no cambiar de programa es el miedo a perder los datos. Con <b>FactuKey</b> importas tus <b>clientes y productos</b> desde Excel o desde tu programa actual con nuestras plantillas oficiales. En minutos lo tienes todo dentro.',
    listTitle: 'La migración, resuelta',
    bullets: [
      {t:'Importación desde Excel', d:'plantillas oficiales de clientes y productos'},
      {t:'Pantalla Importar', d:'subes el archivo y listo'},
      {t:'Sin instalar nada', d:'todo en la nube, desde el navegador'},
      {t:'Te echamos una mano', d:'si te atascas, lo miramos contigo'},
    ],
    highlightTitle: 'Mejor ahora que con prisas',
    highlightText: 'Con VeriFactu en marcha, cuanto antes tengas tu programa al día, menos carreras a última hora.',
    cta: 'Ver cómo cambiarte',
    ctaUrl: WEB + '/cambiar-programa-facturacion/',
  },
  {
    subject: 'Tus clientes ven sus facturas cuando quieren, sin pedírtelas',
    preheader: 'El portal del cliente les da acceso a todas sus facturas. Tú dejas de reenviarlas.',
    headline: '"¿Me puedes reenviar la factura?" Se acabó',
    intro: 'Con el <b>portal del cliente</b> de FactuKey, quien recibe tus facturas entra y ve <b>todas las suyas</b> cuando le hace falta: las consulta, las descarga y las paga. Tú dejas de buscar correos antiguos para reenviar un PDF.',
    listTitle: 'Qué gana cada uno',
    bullets: [
      {t:'Tu cliente', d:'todas sus facturas ordenadas y siempre disponibles'},
      {t:'Tú', d:'cero peticiones de reenvío'},
      {t:'Acceso por NIF', d:'ve juntas las facturas de toda su empresa'},
      {t:'Descarga y pago', d:'desde la misma pantalla'},
    ],
    highlightTitle: 'Da imagen de empresa seria',
    highlightText: 'Un portal propio para tus clientes es de esas cosas que se notan y no cuestan nada.',
    cta: 'Ver el portal',
    ctaUrl: WEB + '/funcionalidades/',
  },
  {
    subject: 'Cada factura con su enlace: se ve sin registrarse en nada',
    preheader: 'Manda un enlace y tu cliente ve la factura al instante, desde el móvil.',
    headline: 'Manda un enlace, no un archivo pesado',
    intro: 'Cada factura de <b>FactuKey</b> tiene su propio enlace público. Se lo pasas al cliente por correo o por WhatsApp y la ve al instante, desde el móvil, <b>sin registrarse ni instalar nada</b>. Y puede descargarla en PDF cuando quiera.',
    listTitle: 'Por qué funciona mejor',
    bullets: [
      {t:'Sin adjuntos pesados', d:'nada de correos rebotados por tamaño'},
      {t:'Se ve en el móvil', d:'sin apps ni registros'},
      {t:'Siempre la última versión', d:'si la corriges, el enlace se actualiza'},
      {t:'Con botón de pago', d:'si tienes el cobro online activado'},
    ],
    highlightTitle: 'Menos fricción, antes cobras',
    highlightText: 'Cuantos menos pasos hay entre tu factura y tu cliente, menos tarda en pagarte.',
    cta: 'Probar FactuKey',
    ctaUrl: APP,
  },
  {
    subject: 'Controla también las facturas que te llegan a ti',
    preheader: 'Facturas recibidas: qué te han facturado, qué has pagado y qué no.',
    headline: 'No solo lo que facturas: también lo que te facturan',
    intro: 'La sección de <b>facturas recibidas</b> te enseña todas las facturas que llegan a tu empresa por tu NIF: cuáles has pagado, cuáles no y cuáles están a medias. Y las exportas para tu gestor cuando toque.',
    listTitle: 'Qué te llevas',
    bullets: [
      {t:'Todas tus recibidas en un sitio', d:'ordenadas por tu NIF'},
      {t:'Estado de pago', d:'pagada, impagada o parcial'},
      {t:'Exportación contable', d:'y descarga en ZIP de todos los PDF'},
      {t:'Envío al gestor', d:'en un clic, sin reenviar correos uno a uno'},
    ],
    highlightTitle: 'El trimestre, mucho más corto',
    highlightText: 'Tener las recibidas ya ordenadas es la mitad del trabajo de cierre.',
    cta: 'Ver funcionalidades',
    ctaUrl: WEB + '/funcionalidades/',
  },
  {
    subject: 'Todas tus facturas guardadas solas en tu Google Drive',
    preheader: 'Copia automática de emitidas y recibidas en tu propio Drive.',
    headline: 'Una copia de todo, sin que hagas nada',
    intro: 'Conecta tu <b>Google Drive</b> a FactuKey y cada factura, emitida o recibida, se guarda sola en tu carpeta. Tú sigues teniendo tus facturas aunque un día decidas irte: son tuyas y están en tu Drive.',
    listTitle: 'Copia de seguridad de verdad',
    bullets: [
      {t:'Automático', d:'se guarda al emitir o al recibir'},
      {t:'En tu Drive', d:'tu cuenta, tus carpetas, tu control'},
      {t:'Emitidas y recibidas', d:'las dos direcciones'},
      {t:'Sin trabajo manual', d:'nada de descargar y subir a mano'},
    ],
    highlightTitle: 'Duerme tranquilo',
    highlightText: 'La ley te obliga a conservar las facturas años. Que se guarden solas quita un problema de encima.',
    cta: 'Ver cómo se conecta',
    ctaUrl: WEB + '/funcionalidades/',
  },
  {
    subject: 'Facturas que se repiten todos los meses: hazlas una vez',
    preheader: 'Cuotas, mantenimientos e iguales: FactuKey las emite solo.',
    headline: 'Si facturas lo mismo cada mes, no lo hagas cada mes',
    intro: 'Cuotas, mantenimientos, alquileres, iguales... Con las <b>facturas recurrentes</b> de FactuKey las configuras una vez y el programa las emite y las envía solo, el día que toca, con su numeración correcta.',
    listTitle: 'Cómo te ahorra tiempo',
    bullets: [
      {t:'Se configuran una vez', d:'periodicidad, cliente y conceptos'},
      {t:'Se emiten solas', d:'el día que tú digas'},
      {t:'Se envían al cliente', d:'sin que te acuerdes tú'},
      {t:'Numeración correcta', d:'sin saltos ni duplicados'},
    ],
    highlightTitle: 'Menos primeros de mes',
    highlightText: 'Si tienes 30 cuotas mensuales, esto te devuelve una mañana entera cada mes.',
    cta: 'Ver facturas recurrentes',
    ctaUrl: WEB + '/facturas-recurrentes/',
  },
  {
    subject: 'Presupuestos con buena pinta que se convierten en factura solos',
    preheader: 'Manda el presupuesto, el cliente lo acepta y ya tienes la factura.',
    headline: 'Del presupuesto a la factura, en un clic',
    intro: 'Haz <b>presupuestos</b> con tu imagen de marca, mándalos por enlace y, cuando el cliente los acepta, conviértelos en factura sin volver a escribir nada. Todo lo que ya pusiste se pasa solo.',
    listTitle: 'Lo que te ahorras',
    bullets: [
      {t:'Presupuestos profesionales', d:'con tu logo y tus colores'},
      {t:'Envío por enlace', d:'el cliente lo ve al momento'},
      {t:'Conversión a factura', d:'sin volver a teclear las líneas'},
      {t:'Seguimiento', d:'sabes cuáles están pendientes de respuesta'},
    ],
    highlightTitle: 'Presupuestar rápido es vender más',
    highlightText: 'El que contesta primero y con buena presencia suele llevarse el trabajo.',
    cta: 'Ver presupuestos',
    ctaUrl: WEB + '/presupuestos-online/',
  },
  {
    subject: 'Cobra por domiciliación bancaria sin líos (remesas SEPA)',
    preheader: 'Genera el fichero SEPA y cobra a todos tus clientes de golpe.',
    headline: 'Cobra a 50 clientes con un solo fichero',
    intro: 'Si cobras por domiciliación, FactuKey te genera la <b>remesa SEPA</b> lista para subir al banco: seleccionas las facturas, se crea el fichero y lo cargas. Se acabó preparar los cobros uno a uno.',
    listTitle: 'Remesas sin dolores de cabeza',
    bullets: [
      {t:'Fichero SEPA estándar', d:'válido para tu banco'},
      {t:'Selección por facturas', d:'tú eliges qué entra en la remesa'},
      {t:'Cuentas de tus clientes', d:'guardadas y reutilizables'},
      {t:'Control de devoluciones', d:'sabes qué ha vuelto'},
    ],
    highlightTitle: 'Ideal para cuotas fijas',
    highlightText: 'Recurrentes + remesa SEPA = facturación y cobro del mes casi sin tocarlo.',
    cta: 'Ver remesas SEPA',
    ctaUrl: WEB + '/remesas-sepa/',
  },
  {
    subject: 'Albaranes que se convierten en factura al final de mes',
    preheader: 'Entrega ahora, factura después. Sin repetir el trabajo.',
    headline: 'Albaranes ahora, una sola factura a fin de mes',
    intro: 'Si entregas varias veces al mismo cliente, haz <b>albaranes</b> en FactuKey y al cerrar el mes los agrupas en una única factura. Ni te olvidas de nada ni tecleas dos veces lo mismo.',
    listTitle: 'Para quien entrega a menudo',
    bullets: [
      {t:'Albarán en el momento', d:'rápido, desde el móvil si hace falta'},
      {t:'Agrupación en factura', d:'todos los del mes, de una vez'},
      {t:'Nada se pierde', d:'lo entregado y no facturado, siempre a la vista'},
      {t:'Con firma del cliente', d:'si la necesitas'},
    ],
    highlightTitle: 'Cierra el mes en un rato',
    highlightText: 'Sin buscar papeles ni preguntar "¿esto se facturó?".',
    cta: 'Ver funcionalidades',
    ctaUrl: WEB + '/funcionalidades/',
  },
  {
    subject: 'Series y numeración de facturas: que no te pillen ahí',
    preheader: 'Numeración correlativa, sin saltos ni duplicados. Automático.',
    headline: 'La numeración de tus facturas, siempre correcta',
    intro: 'Uno de los fallos que más se ven en una inspección es la numeración: saltos, duplicados o series mezcladas. <b>FactuKey</b> lleva las <b>series y la numeración correlativa</b> por ti, y avisa si algo no cuadra.',
    listTitle: 'Higiene básica de facturación',
    bullets: [
      {t:'Numeración correlativa', d:'automática, sin huecos'},
      {t:'Varias series', d:'para rectificativas, tiendas o ejercicios'},
      {t:'Sin duplicados', d:'el sistema no te deja repetir número'},
      {t:'Rectificativas bien hechas', d:'enlazadas a la factura original'},
    ],
    highlightTitle: 'Detalles que evitan sustos',
    highlightText: 'Cumplir en lo básico es lo que hace que una revisión sea un trámite y no un problema.',
    cta: 'Ver facturación electrónica',
    ctaUrl: WEB + '/facturacion-electronica/',
  },
  {
    subject: 'Cuánto llevas facturado este mes, en una pantalla',
    preheader: 'Informes claros: ingresos, clientes top, pendiente de cobro.',
    headline: 'Saber cómo va el negocio no debería costar una tarde',
    intro: 'FactuKey te da los <b>informes</b> que de verdad usas: cuánto llevas facturado, qué clientes pesan más, qué tienes pendiente de cobro y cómo vas respecto al mes pasado. Sin montar un Excel.',
    listTitle: 'Los números a mano',
    bullets: [
      {t:'Facturado por periodo', d:'mes, trimestre o año'},
      {t:'Pendiente de cobro', d:'y desde cuándo'},
      {t:'Ranking de clientes', d:'quién te da de comer'},
      {t:'Exportable', d:'para ti o para tu gestor'},
    ],
    highlightTitle: 'Decidir con datos',
    highlightText: 'Cuando ves los números claros, las decisiones del negocio se toman solas.',
    cta: 'Ver FactuKey',
    ctaUrl: WEB + '/funcionalidades/',
  },
  {
    subject: 'Mándale la contabilidad a tu gestor en un clic',
    preheader: 'Exporta el trimestre entero y se lo envías sin buscar nada.',
    headline: 'El correo de tu gestor pidiendo papeles, resuelto',
    intro: 'Cuando tu gestoría te pide el trimestre, con <b>FactuKey</b> lo tienes en un clic: exportas emitidas y recibidas del periodo, con los PDF en un ZIP, y se lo mandas. Ni carpetas ni "búscame la del taller".',
    listTitle: 'El cierre, en cinco minutos',
    bullets: [
      {t:'Exportación contable', d:'del periodo que elijas'},
      {t:'ZIP con todos los PDF', d:'emitidas y recibidas'},
      {t:'Envío directo al gestor', d:'sin reenviar correos'},
      {t:'Nada se queda fuera', d:'si está en FactuKey, va en la exportación'},
    ],
    highlightTitle: 'Tu gestor te lo va a agradecer',
    highlightText: 'Y cuando la información llega ordenada, salen menos errores y menos preguntas.',
    cta: 'Probar FactuKey',
    ctaUrl: APP,
  },
  {
    subject: 'Factura desde el móvil, justo al terminar el trabajo',
    preheader: 'Sin instalar nada: entras desde el navegador y facturas donde estés.',
    headline: 'Factura antes de arrancar la furgoneta',
    intro: 'FactuKey funciona en el navegador del <b>móvil</b> igual que en el ordenador. Terminas el trabajo, haces la factura ahí mismo y se la mandas al cliente antes de irte. Sin instalar aplicaciones ni acordarte por la noche.',
    listTitle: 'Facturar donde estés',
    bullets: [
      {t:'Desde el navegador', d:'sin instalar nada'},
      {t:'Mismos datos en todos lados', d:'móvil, tablet y ordenador'},
      {t:'Envío al momento', d:'por correo o por enlace'},
      {t:'Cobro en el sitio', d:'con el botón de tarjeta o Bizum'},
    ],
    highlightTitle: 'La factura que se hace en caliente, se cobra antes',
    highlightText: 'Las que se dejan para "el domingo" son las que acaban olvidadas.',
    cta: 'Empezar ahora',
    ctaUrl: APP,
  },
  {
    subject: 'Facturas con tu marca, no con la de tu programa',
    preheader: 'Tu logo, tus colores y tus correos, editables desde Plantillas.',
    headline: 'Que tus facturas parezcan tuyas',
    intro: 'En FactuKey pones <b>tu logo y tus colores</b> en facturas, presupuestos y albaranes, y además puedes editar los <b>correos</b> que reciben tus clientes desde la sección Plantillas. Tu marca, en cada envío.',
    listTitle: 'Personalización real',
    bullets: [
      {t:'Logo y colores', d:'en todos tus documentos'},
      {t:'Plantillas de correo', d:'editas el texto que recibe tu cliente'},
      {t:'Textos legales propios', d:'condiciones, formas de pago, notas'},
      {t:'Varias empresas', d:'cada una con su identidad'},
    ],
    highlightTitle: 'La imagen también cobra',
    highlightText: 'Una factura bien presentada transmite orden. Y a quien parece ordenado se le paga antes.',
    cta: 'Ver FactuKey',
    ctaUrl: WEB + '/funcionalidades/',
  },
  {
    subject: 'VeriFactu: qué es y por qué te afecta',
    preheader: 'Te lo contamos en claro, sin tecnicismos, y con tu programa ya preparado.',
    headline: 'VeriFactu, en cristiano',
    intro: 'VeriFactu obliga a que tu programa de facturación genere las facturas de forma <b>trazable e inalterable</b> y pueda enviarlas a la Agencia Tributaria. Traducido: tu programa tiene que estar adaptado. <b>FactuKey ya lo está</b>, y tú no tienes que hacer nada raro.',
    listTitle: 'Qué significa para ti',
    bullets: [
      {t:'Facturas con huella y QR', d:'como pide la normativa'},
      {t:'Registro de cada factura', d:'trazable, sin poder alterarla después'},
      {t:'Envío a la AEAT', d:'preparado y automático'},
      {t:'Tú sigues facturando igual', d:'el trabajo lo hace el programa'},
    ],
    highlightTitle: 'Sin sustos ni prisas',
    highlightText: 'El que llega con el programa ya adaptado no nota el cambio. El que llega tarde, sí.',
    cta: 'Leer sobre VeriFactu',
    ctaUrl: WEB + '/verifactu/',
  },
  {
    subject: 'Te regalamos una plantilla de factura en Excel',
    preheader: 'Descárgala gratis, sin registro. Y si quieres algo mejor, ya sabes dónde estamos.',
    headline: 'Una plantilla de factura gratis, sin pedirte nada',
    intro: 'Hemos preparado una <b>plantilla de factura en Excel</b> con los cálculos ya hechos (base, IVA y total) y los campos que la normativa exige. Es gratis, se descarga sin registro y es tuya.',
    listTitle: 'Qué incluye',
    bullets: [
      {t:'Cálculos automáticos', d:'base imponible, IVA y total'},
      {t:'Campos obligatorios', d:'los que pide la normativa'},
      {t:'Lista para usar', d:'la abres y facturas'},
      {t:'Sin registro', d:'descarga directa'},
    ],
    highlightTitle: 'Y cuando el Excel se te quede corto',
    highlightText: 'Aquí estamos. FactuKey hace lo mismo pero sin fórmulas rotas ni archivos duplicados.',
    cta: 'Descargar la plantilla',
    ctaUrl: WEB + '/plantilla-factura-gratis',
  },
];

// ─────────────────────────────────────────────────────────────────────
// 20 plantillas — GESTORÍAS Y ASESORÍAS
// ─────────────────────────────────────────────────────────────────────
const TEMPLATES_GESTORIAS = [
  {
    subject: 'Programa Partner FactuKey: comisión recurrente para tu gestoría',
    preheader: 'Recomienda FactuKey a tus clientes y gana una comisión cada mes.',
    headline: 'Gana una comisión recurrente con el Programa Partner',
    intro: 'En <b>FactuKey</b> tenemos un <b>Programa Partner</b> pensado para gestorías y asesorías como la tuya: recomienda nuestro software de facturación a tus clientes y gana una <b>comisión recurrente</b> todos los meses, mientras ellos ganan en comodidad y cumplimiento.',
    listTitle: 'Qué te aporta ser Partner',
    bullets: [
      {t:'Comisión recurrente', d:'ingresos cada mes por cada cliente'},
      {t:'Software adaptado a VeriFactu', d:'tus clientes cumplen la normativa'},
      {t:'Panel para tus clientes', d:'gestionas su facturación más fácil'},
      {t:'Soporte prioritario', d:'te acompañamos en todo el proceso'},
    ],
    highlightTitle: 'Gana dinero con lo que ya haces',
    highlightText: 'Ya recomiendas herramientas a tus clientes. Con nuestro Programa Partner, además, te llevas una comisión.',
    cta: 'Quiero ser Partner',
    ctaUrl: WEB + '/software-facturacion-asesorias/',
  },
  {
    subject: 'La facturación de todos tus clientes desde un único panel',
    preheader: 'FactuKey para gestorías: controla las facturas de tus clientes en un sitio.',
    headline: 'Un único panel para la facturación de todos tus clientes',
    intro: 'Con <b>FactuKey</b> tu gestoría centraliza la facturación de todos tus clientes en un mismo lugar. Menos idas y venidas, menos errores y todo <b>adaptado a VeriFactu</b> y a la normativa vigente.',
    listTitle: 'Para tu gestoría',
    bullets: [
      {t:'Todos tus clientes en un panel', d:'sin saltar de programa en programa'},
      {t:'Adaptado a VeriFactu', d:'tus clientes siempre al día'},
      {t:'Menos errores y menos tiempo', d:'la información, ordenada'},
      {t:'Soporte cercano', d:'te ayudamos cuando lo necesites'},
    ],
    highlightTitle: 'Te lo enseñamos sin compromiso',
    highlightText: 'Pide una demo y te mostramos cómo FactuKey te simplifica el día a día con tus clientes.',
    cta: 'Pedir una demo',
    ctaUrl: WEB + '/contacto/',
  },
  {
    subject: 'Ten a tus clientes listos para VeriFactu sin quebraderos de cabeza',
    preheader: 'VeriFactu ya está aquí. Con FactuKey tus clientes están preparados.',
    headline: 'VeriFactu: ten a tus clientes preparados desde ya',
    intro: 'La facturación está cambiando y tus clientes van a necesitar herramientas <b>adaptadas a VeriFactu</b>. Con <b>FactuKey</b> lo tienen resuelto: un software sencillo, en la nube y preparado para la normativa vigente, para que tu gestoría vaya siempre por delante.',
    listTitle: 'Por qué te interesa',
    bullets: [
      {t:'Adaptado a VeriFactu', d:'preparado para la normativa vigente'},
      {t:'Sencillo para tus clientes', d:'menos consultas y menos soporte'},
      {t:'En la nube', d:'sin instalaciones ni actualizaciones manuales'},
      {t:'Programa Partner', d:'además, puedes llevarte una comisión'},
    ],
    highlightTitle: 'Adelántate al cambio',
    highlightText: 'Preparar a tus clientes ahora te evita prisas y problemas después. Te contamos cómo.',
    cta: 'Más información',
    ctaUrl: WEB + '/verifactu/',
  },
  {
    subject: 'Menos soporte: clientes que se manejan solos con sus facturas',
    preheader: 'FactuKey es tan sencillo que tus clientes dejan de llamarte por tonterías.',
    headline: 'Recupera horas: clientes que se manejan solos',
    intro: '¿Cuántas horas dedicas a resolver dudas de facturación de tus clientes? Con <b>FactuKey</b>, un software sencillo y <b>adaptado a VeriFactu</b>, tus clientes hacen sus facturas solos y tu gestoría recupera tiempo para lo que de verdad aporta valor.',
    listTitle: 'Lo que gana tu gestoría',
    bullets: [
      {t:'Menos soporte del día a día', d:'clientes más autónomos'},
      {t:'Información ordenada', d:'te llega todo listo y sin errores'},
      {t:'Adaptado a VeriFactu', d:'cumplimiento asegurado'},
      {t:'Programa Partner', d:'comisión recurrente por recomendarlo'},
    ],
    highlightTitle: 'Gana tiempo (y una comisión)',
    highlightText: 'Te enseñamos cómo FactuKey te quita trabajo repetitivo y, además, puede darte ingresos.',
    cta: 'Quiero saber más',
    ctaUrl: WEB + '/software-facturacion-asesorias/',
  },
  {
    subject: 'Recibe el trimestre de tus clientes ya ordenado',
    preheader: 'Exportación contable y ZIP con todos los PDF, en un clic.',
    headline: 'Se acabó pedir papeles cliente por cliente',
    intro: 'Con <b>FactuKey</b>, tus clientes te envían el periodo completo en un clic: <b>exportación contable</b> de emitidas y recibidas más un <b>ZIP con todos los PDF</b>. Ni carpetas compartidas ni cadenas de correos.',
    listTitle: 'El cierre, sin fricción',
    bullets: [
      {t:'Exportación contable', d:'del periodo que necesites'},
      {t:'ZIP con todos los PDF', d:'emitidas y recibidas'},
      {t:'Envío directo a la gestoría', d:'desde el propio programa'},
      {t:'Sin huecos', d:'lo que está facturado, está en la exportación'},
    ],
    highlightTitle: 'Menos persecución, más asesoría',
    highlightText: 'El tiempo que hoy pierdes reclamando documentos es el que podrías dedicar a asesorar de verdad.',
    cta: 'Ver cómo funciona',
    ctaUrl: WEB + '/software-facturacion-asesorias/',
  },
  {
    subject: 'Migra a tus clientes de programa sin perder un dato',
    preheader: 'Importación de clientes y productos desde Excel o su programa actual.',
    headline: 'Cambiar a tus clientes de programa, sin dramas',
    intro: 'Lo que frena a una gestoría a mover a sus clientes de software es la migración. Con <b>FactuKey</b> se importan <b>clientes y productos</b> desde Excel o desde el programa actual con plantillas oficiales. Cliente a cliente, en minutos.',
    listTitle: 'La migración, resuelta',
    bullets: [
      {t:'Plantillas oficiales', d:'clientes y productos'},
      {t:'Pantalla Importar', d:'sube el archivo y listo'},
      {t:'Uno a uno o en tanda', d:'a tu ritmo'},
      {t:'Te acompañamos', d:'los primeros los hacemos contigo'},
    ],
    highlightTitle: 'Antes de que llegue la avalancha',
    highlightText: 'Mover clientes con calma no se parece en nada a moverlos con la normativa encima.',
    cta: 'Ver la migración',
    ctaUrl: WEB + '/cambiar-programa-facturacion/',
  },
  {
    subject: 'Que tus clientes cobren antes también es cosa tuya',
    preheader: 'Cobro con tarjeta o Bizum desde la factura: menos morosidad en tu cartera.',
    headline: 'Un cliente que cobra a tiempo es un cliente que dura',
    intro: 'FactuKey permite que las facturas de tus clientes lleven <b>botón de pago con tarjeta o Bizum</b>, con el dinero yendo <b>directo a su banco</b>. Menos impagados en tu cartera significa menos problemas de tesorería que acaban en tu mesa.',
    listTitle: 'Lo que cambia',
    bullets: [
      {t:'Pago desde la factura', d:'tarjeta o Bizum'},
      {t:'Directo a su cuenta', d:'FactuKey no retiene el dinero'},
      {t:'Se marca pagada sola', d:'la conciliación es más limpia'},
      {t:'Menos morosidad', d:'y menos llamadas de apuro'},
    ],
    highlightTitle: 'Tu cliente te lo agradece',
    highlightText: 'Recomendar algo que le hace cobrar antes es de las mejores cosas que puedes hacer por él.',
    cta: 'Ver el cobro online',
    ctaUrl: WEB + '/cobro-online-facturas/',
  },
  {
    subject: 'Los impagados de tus clientes, reclamados en automático',
    preheader: 'Recordatorios automáticos con enlace de pago. Sin que nadie llame a nadie.',
    headline: 'La morosidad, atacada desde el propio programa',
    intro: 'FactuKey envía <b>recordatorios automáticos</b> de las facturas impagadas de tus clientes, con el enlace de pago incluido, y los para en cuanto se cobra. Un panel de impagados que se gestiona solo.',
    listTitle: 'Cómo funciona',
    bullets: [
      {t:'Avisos programados', d:'a los días que se decidan'},
      {t:'Con enlace de pago', d:'se cobra desde el propio aviso'},
      {t:'Panel de impagados', d:'quién debe, cuánto y desde cuándo'},
      {t:'Se detienen al cobrar', d:'nunca se reclama algo ya pagado'},
    ],
    highlightTitle: 'Un argumento fácil de vender',
    highlightText: 'A ningún cliente hay que explicarle dos veces por qué le interesa cobrar antes.',
    cta: 'Ver recordatorios',
    ctaUrl: WEB + '/cobro-online-facturas/',
  },
  {
    subject: 'Todas las facturas de una empresa juntas, aunque lleguen a varios correos',
    preheader: 'Portal por NIF: se reclama el NIF y aparecen todas las facturas de esa empresa.',
    headline: 'El portal por NIF: se acabó buscar facturas por los correos',
    intro: 'En muchas empresas las facturas llegan a tres o cuatro buzones distintos. Con el <b>portal por NIF</b> de FactuKey, la empresa reclama su NIF, verifica por código y ve <b>todas sus facturas juntas</b>, vengan de donde vengan.',
    listTitle: 'Por qué le vas a sacar partido',
    bullets: [
      {t:'Todo por NIF', d:'no por buzón de correo'},
      {t:'Verificación por código', d:'solo accede quien debe'},
      {t:'Nada se traspapela', d:'ni facturas perdidas en un correo antiguo'},
      {t:'Descarga en bloque', d:'para pasártelo a ti'},
    ],
    highlightTitle: 'Menos "esta no la tengo"',
    highlightText: 'La mayoría de facturas que faltan en un cierre no se perdieron: están en otro buzón.',
    cta: 'Ver el portal',
    ctaUrl: WEB + '/funcionalidades/',
  },
  {
    subject: 'Factura tus propios honorarios sin dedicarle un día al mes',
    preheader: 'Cuotas de asesoría con facturas recurrentes y remesa SEPA.',
    headline: 'Tus iguales, facturados y cobrados solos',
    intro: 'Además de para tus clientes, FactuKey te sirve a ti: configura las <b>cuotas de asesoría</b> como <b>facturas recurrentes</b>, se emiten y se envían solas, y generas la <b>remesa SEPA</b> para cobrarlas todas de golpe.',
    listTitle: 'Tu propia facturación',
    bullets: [
      {t:'Recurrentes', d:'los iguales se emiten solos cada mes'},
      {t:'Remesa SEPA', d:'un fichero y cobras a toda la cartera'},
      {t:'Control de devoluciones', d:'sabes qué ha vuelto'},
      {t:'Numeración impecable', d:'sin saltos ni duplicados'},
    ],
    highlightTitle: 'Predica con el ejemplo',
    highlightText: 'Es más fácil recomendar una herramienta que ya usas tú todos los meses.',
    cta: 'Ver recurrentes y SEPA',
    ctaUrl: WEB + '/facturas-recurrentes/',
  },
  {
    subject: 'Las facturas recibidas de tus clientes, bajo control',
    preheader: 'Qué les han facturado, qué han pagado y qué falta. Todo por NIF.',
    headline: 'El otro lado del trimestre: lo que les facturan a ellos',
    intro: 'La sección de <b>facturas recibidas</b> ordena por NIF todo lo que le facturan a tu cliente, con su estado de pago, y te lo exporta. La parte que suele faltar cuando llega el cierre.',
    listTitle: 'Lo que resuelve',
    bullets: [
      {t:'Recibidas por NIF', d:'todas juntas y ordenadas'},
      {t:'Estado de pago', d:'pagada, impagada o parcial'},
      {t:'Exportación y ZIP', d:'listo para contabilizar'},
      {t:'Aceptar o rechazar', d:'con aviso al emisor'},
    ],
    highlightTitle: 'Cierres más limpios',
    highlightText: 'Cuando las recibidas llegan ordenadas, el cierre deja de ser una carrera de obstáculos.',
    cta: 'Ver funcionalidades',
    ctaUrl: WEB + '/funcionalidades/',
  },
  {
    subject: 'Copia automática de las facturas de tus clientes en Drive',
    preheader: 'Emitidas y recibidas guardadas solas. Conservación resuelta.',
    headline: 'La obligación de conservar, resuelta sola',
    intro: 'FactuKey guarda automáticamente en <b>Google Drive</b> las facturas emitidas y recibidas de cada empresa. La obligación de conservación deja de depender de que alguien se acuerde de hacer copias.',
    listTitle: 'Conservación sin esfuerzo',
    bullets: [
      {t:'Automático', d:'al emitir y al recibir'},
      {t:'En su propio Drive', d:'la empresa mantiene el control'},
      {t:'Emitidas y recibidas', d:'las dos direcciones'},
      {t:'Sin trabajo manual', d:'nadie tiene que descargar y subir nada'},
    ],
    highlightTitle: 'Un problema menos en la lista',
    highlightText: 'Las copias que dependen de la buena voluntad de alguien acaban no existiendo.',
    cta: 'Ver FactuKey',
    ctaUrl: WEB + '/funcionalidades/',
  },
  {
    subject: 'Los errores de numeración de tus clientes, eliminados de raíz',
    preheader: 'Series y correlativos automáticos, rectificativas bien enlazadas.',
    headline: 'Menos correcciones que hacer a final de trimestre',
    intro: 'Saltos de numeración, series mezcladas, rectificativas sueltas... el trabajo de limpieza que te cae cada trimestre. <b>FactuKey</b> lleva las <b>series y el correlativo</b> automáticamente y enlaza cada <b>rectificativa</b> con su original.',
    listTitle: 'Higiene de facturación',
    bullets: [
      {t:'Correlativo automático', d:'sin huecos ni duplicados'},
      {t:'Series separadas', d:'por tipo, ejercicio o punto de venta'},
      {t:'Rectificativas enlazadas', d:'a la factura que corrigen'},
      {t:'Facturas simplificadas', d:'con sus límites bien aplicados'},
    ],
    highlightTitle: 'Cada error que no ocurre',
    highlightText: 'es media hora que no le dedicas a arreglarlo en el cierre.',
    cta: 'Ver facturación electrónica',
    ctaUrl: WEB + '/facturacion-electronica/',
  },
  {
    subject: 'Una demo de 20 minutos y decides',
    preheader: 'Te enseñamos FactuKey con un caso real de tu tipo de cliente.',
    headline: 'Te lo enseñamos con un cliente tipo tuyo',
    intro: 'Sin presentaciones genéricas: nos cuentas cómo trabajas con tus clientes y te enseñamos <b>FactuKey</b> montado sobre ese caso. Veinte minutos y sales sabiendo si te encaja o no.',
    listTitle: 'Qué verás en la demo',
    bullets: [
      {t:'El panel de gestoría', d:'con varios clientes dentro'},
      {t:'Un cierre completo', d:'de la factura a la exportación'},
      {t:'El Programa Partner', d:'condiciones y comisiones'},
      {t:'Tus dudas', d:'las que traigas, respondidas'},
    ],
    highlightTitle: 'Sin compromiso y sin insistir',
    highlightText: 'Si no te encaja, nos lo dices y no volvemos a molestarte.',
    cta: 'Pedir la demo',
    ctaUrl: WEB + '/contacto/',
  },
  {
    subject: 'La ola de cambios de programa ya ha empezado',
    preheader: 'Las gestorías que se han movido antes lo están viviendo mucho más tranquilas.',
    headline: 'Mejor mover clientes ahora que todos a la vez',
    intro: 'Con la normativa de facturación en marcha, muchas empresas van a tener que cambiar de programa. Las gestorías que están moviendo su cartera <b>ahora</b>, con calma, lo están haciendo cliente a cliente y sin incidencias.',
    listTitle: 'Por qué antes es mejor',
    bullets: [
      {t:'Sin colas de soporte', d:'ni tuyo ni nuestro'},
      {t:'Cliente a cliente', d:'a tu ritmo, sin prisas'},
      {t:'Formación repartida', d:'en vez de todo en una semana'},
      {t:'Posicionas tu gestoría', d:'como la que se lo dio resuelto'},
    ],
    highlightTitle: 'El que avisa primero, gana',
    highlightText: 'Ser tú quien le trae la solución al cliente vale más que cualquier campaña.',
    cta: 'Hablemos',
    ctaUrl: WEB + '/contacto/',
  },
  {
    subject: 'Control por cliente: quién factura, quién no y quién no cobra',
    preheader: 'Informes por empresa para ver de un vistazo cómo va tu cartera.',
    headline: 'Ver tu cartera de un vistazo',
    intro: 'Con FactuKey ves <b>por cliente</b> cuánto lleva facturado, qué tiene pendiente de cobro y si está emitiendo con normalidad. La información que te permite adelantarte a una llamada en vez de reaccionar a ella.',
    listTitle: 'Datos que sirven',
    bullets: [
      {t:'Facturado por empresa', d:'y por periodo'},
      {t:'Pendiente de cobro', d:'y antigüedad de la deuda'},
      {t:'Quién ha dejado de emitir', d:'señal de alarma temprana'},
      {t:'Exportable', d:'para tu propio seguimiento'},
    ],
    highlightTitle: 'Asesorar es anticiparse',
    highlightText: 'El cliente valora la llamada que le haces antes de que él tenga el problema.',
    cta: 'Ver FactuKey',
    ctaUrl: WEB + '/software-facturacion-asesorias/',
  },
  {
    subject: 'Una plantilla de factura gratis para tus clientes',
    preheader: 'Excel con los cálculos hechos y los campos obligatorios. Sin registro.',
    headline: 'Un recurso gratis que puedes pasarle a tus clientes',
    intro: 'Hemos preparado una <b>plantilla de factura en Excel</b> con los cálculos ya montados y los campos que exige la normativa. Es gratis y sin registro: pásasela a los clientes que todavía facturan a mano.',
    listTitle: 'Qué incluye',
    bullets: [
      {t:'Cálculos automáticos', d:'base, IVA y total'},
      {t:'Campos obligatorios', d:'los que pide la normativa'},
      {t:'Descarga directa', d:'sin registro'},
      {t:'Úsala como quieras', d:'con tu logo si te apetece'},
    ],
    highlightTitle: 'Y el siguiente paso, cuando toque',
    highlightText: 'Un Excel no cumple VeriFactu. Sirve para empezar, no para quedarse.',
    cta: 'Descargar la plantilla',
    ctaUrl: WEB + '/plantilla-factura-gratis',
  },
  {
    subject: 'Precios claros y sin permanencia, también para tus clientes',
    preheader: 'Sin cuotas de alta, sin ataduras y con condiciones de Partner.',
    headline: 'Precios que puedes recomendar sin miedo',
    intro: 'Recomendar una herramienta es poner tu nombre encima. Por eso en <b>FactuKey</b> los precios son claros: hay <b>plan gratuito</b>, <b>14 días de prueba sin tarjeta</b> en los planes de pago y <b>sin permanencia</b>. Y las gestorías Partner tienen sus propias condiciones.',
    listTitle: 'Nuestras reglas',
    bullets: [
      {t:'Sin permanencia', d:'se cancela cuando se quiera, sin penalización'},
      {t:'14 días de prueba', d:'y sin pedir tarjeta de crédito'},
      {t:'Condiciones Partner', d:'para tu cartera'},
      {t:'Sus datos son suyos', d:'exportables cuando quiera'},
    ],
    highlightTitle: 'Tu prestigio, protegido',
    highlightText: 'No te vamos a poner en el compromiso de haber recomendado algo con letra pequeña.',
    cta: 'Ver precios',
    ctaUrl: WEB + '/precios/',
  },
  {
    subject: 'Rectificativas y simplificadas: que dejen de llegarte mal',
    preheader: 'FactuKey obliga a hacerlas bien, así no te toca corregirlas a ti.',
    headline: 'Que las rectificativas lleguen bien hechas',
    intro: 'Rectificativas sin enlazar, simplificadas por encima del límite, abonos hechos a mano... llegan a tu mesa y las arreglas tú. En <b>FactuKey</b> el programa <b>no deja hacerlas mal</b>.',
    listTitle: 'Errores que desaparecen',
    bullets: [
      {t:'Rectificativa enlazada', d:'siempre a su factura original'},
      {t:'Simplificadas controladas', d:'con sus límites aplicados'},
      {t:'Serie propia', d:'para no ensuciar la numeración normal'},
      {t:'Trazabilidad', d:'se ve qué corrigió qué'},
    ],
    highlightTitle: 'Prevenir sale más barato',
    highlightText: 'Un programa que no deja equivocarse ahorra más horas que cualquier revisión posterior.',
    cta: 'Ver facturación electrónica',
    ctaUrl: WEB + '/facturacion-electronica/',
  },
  {
    subject: '¿Hablamos de cómo trabajáis con la facturación de vuestros clientes?',
    preheader: 'Sin demo ni presentación: una conversación de diez minutos.',
    headline: 'Sin presentación: una conversación',
    intro: 'Después de varios correos, quizá lo más útil sea simplemente hablar. Nos cuentas cómo lleváis hoy la facturación de vuestros clientes y te decimos con sinceridad si <b>FactuKey</b> os aporta algo o no.',
    listTitle: 'Cómo lo hacemos',
    bullets: [
      {t:'Diez minutos', d:'cuando te venga bien'},
      {t:'Sin presentación', d:'preguntas y respuestas'},
      {t:'Sin insistir', d:'si no encaja, se acabó'},
      {t:'Con quien lo ha hecho', d:'no con un comercial de guion'},
    ],
    highlightTitle: 'Y si prefieres no hablar',
    highlightText: 'Responde a este correo con tus dudas y te contestamos por escrito. Igual de válido.',
    cta: 'Escríbenos',
    ctaUrl: WEB + '/contacto/',
  },
];

function buildEmail(row, tipo){
  const isGest = tipo === 'gestorias';
  const templates = isGest ? TEMPLATES_GESTORIAS : TEMPLATES_NEGOCIOS;
  const veces = parseInt((isGest ? row.veces_enviado : row.veces_enviado_factukey) || 0, 10) || 0;
  // Secuencia: cada envio usa la SIGUIENTE plantilla. El modulo es solo una red
  // de seguridad por si la SQL dejara pasar un lead con la secuencia agotada.
  const idx = ((veces % templates.length) + templates.length) % templates.length;
  const v = templates[idx];
  const path = isGest ? 'unsubscribe-factukey-gestorias' : 'unsubscribe-factukey-negocios';
  const q = '?uuid=' + encodeURIComponent(row.uuid || '');
  // Enlace visible: GET, solo abre la página con el botón (no da de baja solo).
  const unsub = 'https://n8n.digitalnexo.es/webhook/' + path + q;
  // Cabecera List-Unsubscribe One-Click: POST, esa sí da de baja directamente.
  const unsubPost = 'https://n8n.digitalnexo.es/webhook/' + path + '-baja' + q;
  return {
    subject: v.subject,
    html: skeleton(v, unsub),
    text: plainText(v, unsub),
    unsub: unsub,
    unsubPost: unsubPost,
    variante: idx,
    total: templates.length,
  };
}

// Cuerpo exacto de la llamada a Amazon SES (v2 SendEmail). Se construye aquí
// para no tener que escapar HTML dentro de una expresión de n8n.
function buildSes(row, tipo){
  const out = buildEmail(row, tipo);
  const correo = String(row.correo || '').trim();
  return {
    ses: {
      FromEmailAddress: 'FactuKey <comercial@factukey.es>',
      Destination: { ToAddresses: [correo] },
      ReplyToAddresses: ['info@factukey.com'],
      // Conjunto de configuración propio de la campaña: sus rebotes y quejas se
      // miden aparte de los del correo de la app, y se puede parar SOLO la
      // campaña sin tocar el envío de facturas.
      ConfigurationSetName: 'campana-captacion',
      Content: {
        Simple: {
          Subject: { Data: out.subject, Charset: 'UTF-8' },
          Body: {
            Text: { Data: out.text, Charset: 'UTF-8' },
            Html: { Data: out.html, Charset: 'UTF-8' },
          },
          Headers: [
            { Name: 'List-Unsubscribe', Value: '<' + out.unsubPost + '>, <' + out.unsub + '>' },
            { Name: 'List-Unsubscribe-Post', Value: 'List-Unsubscribe=One-Click' },
          ],
        },
      },
    },
    email: correo,
    subject: out.subject,
    html: out.html,
    text: out.text,
    variante: out.variante,
    total_plantillas: out.total,
  };
}
