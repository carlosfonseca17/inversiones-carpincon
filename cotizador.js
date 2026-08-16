/* ============================================================
   CARPINCON — COTIZADOR INTELIGENTE
   ============================================================
   ⚙️  PANEL DE PRECIOS Y OPCIONES
   Todo lo que Carpincon necesita editar (precios, telas,
   colores, maderas, descuentos, garantía, tiempos de entrega)
   vive en el objeto CONFIG de aquí abajo. No es necesario tocar
   nada más en este archivo para actualizar precios o agregar
   opciones nuevas.

   Los valores marcados con ⚠️ son EJEMPLOS o SUPUESTOS porque el
   documento de cambios no especificó un dato exacto para ese
   punto — revísalos antes de publicar.

   🖼️  FOTOS DEL SOFÁ (vista previa)
   La vista previa grande ya NO es un dibujo SVG: usa fotos reales
   guardadas en img/sofas/ e img/telas/ (ver SOFA_VARIANTES y
   CONFIG.telas[].foto más abajo). Si agregas más fotos con más
   tamaños por forma, solo agrégalas a SOFA_VARIANTES — el resto
   del código las usa automáticamente.
   ============================================================ */

const CONFIG = {

  // Formas de sofá/sala disponibles.
  // minPuestos = mínimo de puestos permitido para esa forma.
  // puestosChaise / puestosLateral = cuántos puestos del total
  // "consume" la chaise (L) o cada lateral (U) — el resto se
  // reparte en el tramo recto. ⚠️ SUPUESTO: el documento dice que
  // la L y la U "suman puestos" pero no da el reparto exacto;
  // aquí se fijó chaise = 2 puestos y cada lateral de la U = 2
  // puestos. Ajusta estos números si tu regla real es distinta.
  formas: {
    recto: { nombre: "Recto", icono: "▭", descripcion: "El clásico, ideal para espacios lineales.", minPuestos: 2 },
    l:     { nombre: "En L",  icono: "⌐", descripcion: "Con chaise longue. La chaise suma puestos al total.", minPuestos: 5, puestosChaise: 2 },
    u:     { nombre: "En U",  icono: "⊔", descripcion: "Dos laterales. Cada lateral suma puestos al total.",  minPuestos: 7, puestosLateral: 2 }
  },
  puestosMax: 10, // ⚠️ ejemplo — tope superior del contador de puestos

  // Telas disponibles. El precio por puesto YA NO vive en la tela:
  // ahora el precio base por puesto depende del SERVICIO (ver
  // CONFIG.servicios.precioPorPuesto). La tela solo aporta un
  // "multiplicador" sobre ese precio base. "requiereCotizacion: true"
  // hace que el sistema NO calcule un total y muestre el aviso de
  // que un asesor cotizará manualmente.
  //
  // foto: ruta a la muestra cuadrada real de la tela (img/telas/).
  // Se usa tanto en los chips (grande y mini) como en la textura que
  // se superpone sobre la foto del sofá en la vista previa. Si una
  // tela no tiene foto (ej. "otra"), se usa el patrón CSS de
  // patternClass como respaldo.
  telas: {
    antifluidos_premium: { nombre: "Antifluidos Premium",                 multiplicador: 1, patternClass: "tela-antifluidos", foto: "img/telas/antifluidos.png" },
    antifluidos_mascotas:{ nombre: "Antifluidos amigable con mascotas",   multiplicador: 1, patternClass: "tela-antifluidos", foto: "img/telas/antifluidos-mascota.png" },
    // ⚠️ SUPUESTO: se conserva la relación previa ("el doble") ahora aplicada
    // sobre el precio base del servicio elegido. Confirma si Pranna debe
    // seguir siendo el doble tanto en Retapizado como en Sala Nueva.
    pranna:               { nombre: "Sintético Pranna",                   multiplicador: 2, patternClass: "tela-pranna", foto: "img/telas/pranna.png" },
    otra:                 { nombre: "Otra tela (Solicitar cotización)",   multiplicador: null, patternClass: "tela-otra", requiereCotizacion: true }
  },

  // Colores disponibles para el tapizado (solo visual, no afectan precio).
  colores: [
    { id:"beige",     nombre:"Beige",          hex:"#D8CBB0" },
    { id:"gris",      nombre:"Gris",           hex:"#9C9A93" },
    { id:"terracota", nombre:"Terracota",      hex:"#B5654A" },
    { id:"oliva",     nombre:"Verde oliva",    hex:"#6B7355" },
    { id:"petroleo",  nombre:"Azul petróleo",  hex:"#3C5A66" },
    { id:"negro",     nombre:"Negro",          hex:"#221D19" }
  ],

  servicios: {
    retapizado_premium: {
      nombre: "Retapizado Premium",
      descripcion: "Restauramos completamente tu sofá: cambio de tela y materiales internos. La estructura original se conserva, no se cambia.",
      icono: "🪡",
      precioPorPuesto: 750000,
      precioDesdeTexto: "Desde $750.000 por puesto",
      incluyeSiempre: ["Cambio de espuma", "Cambio de cinchas y resortes"],
      noIncluye: ["Cambio de estructura (se conserva la estructura original)"]
    },
    sala_nueva: {
      nombre: "Sala Nueva Premium a Medida",
      descripcion: "Diseñamos y fabricamos tu sala completamente desde cero.",
      icono: "✨",
      precioPorPuesto: 1050000,
      precioDesdeTexto: "Desde $1.050.000 por puesto"
    }
  },

  // Descuento automático por volumen (se aplica al subtotal).
  // ⚠️ Carpincon debe confirmar los porcentajes reales.
  descuentoVolumen: [
    { minPuestos: 3, descuento: 0.05 },
    { minPuestos: 5, descuento: 0.10 }
  ],

  // Adiciones.
  addons: {
    cojinDecorativo: 50000,        // por unidad — dado
    // Transporte: ahora varía según el servicio y es activable/desactivable
    // desde el paso "Detalles" (por defecto va activado).
    transporte: {
      retapizado_premium: 200000,  // incluye recogida del mueble actual + entrega
      sala_nueva: 150000           // solo entrega, no hay nada que recoger
    },
    puffAdicional: 450000          // dado — solo Sala Nueva Premium
  },

  // Solo aplica a "Sala Nueva Premium". No modifican el precio.
  maderas: [
    { id:"pino", nombre:"Pino Horneado Premium", extraPorPuesto: 0 },
    { id:"sajo", nombre:"Sajo Horneado Premium",  extraPorPuesto: 0 }
  ],
  // No modifican el precio. Los id deben coincidir con los prefijos de
  // archivo en img/sofas/ (ver SOFA_VARIANTES / getSofaFotoPath).
  patas: [
    { id:"metalica",       nombre:"Patas metálicas" },
    { id:"madera_conica",  nombre:"Patas en madera" }
  ],

  garantiaMeses: 12, // ⚠️ confirmar con Carpincon
  tiempoEntregaDiasHabiles: { retapizado_premium: 8, sala_nueva: 20 }, // ⚠️ ejemplo

  whatsapp: "573246884807"
};

/* ============================================================
   ESTADO
   ============================================================ */
const state = {
  servicio: null,
  forma: "recto",       // recto | l | u
  puestos: 3,
  telaId: "antifluidos_premium",
  colorId: "beige",
  cojinesDecorativos: 0,
  puff: false,
  transporte: true, // activado por defecto; se puede desactivar y volver a activar
  maderaId: "pino",
  pataId: "madera_conica",
  ubicacion: ""
};

const STEP_IDS = ["servicio", "forma", "tela", "detalles", "resumen"];
let currentStep = 0;

/* ============================================================
   GENERAR OPCIONES EN PANTALLA A PARTIR DE CONFIG
   (una sola fuente de verdad: si agregas una tela, color,
   forma, madera o pata en CONFIG, aparece aquí automáticamente)
   ============================================================ */
function renderServicioCards(){
  const cont = document.getElementById("cz-servicio-grid");
  if(!cont) return;
  cont.innerHTML = "";
  Object.entries(CONFIG.servicios).forEach(([id, s]) => {
    const div = document.createElement("div");
    div.className = "cz-option-card";
    div.dataset.servicio = id;
    div.innerHTML = `<span class="ic">${s.icono}</span><h4>${s.nombre}</h4><p>${s.descripcion}</p><span class="precio-tag">${s.precioDesdeTexto}</span>`;
    cont.appendChild(div);
  });
}

function renderFormaCards(){
  const cont = document.getElementById("cz-forma-grid");
  if(!cont) return;
  cont.innerHTML = "";
  Object.entries(CONFIG.formas).forEach(([id, f]) => {
    const div = document.createElement("div");
    div.className = "cz-option-card";
    div.dataset.forma = id;
    div.innerHTML = `<span class="ic">${f.icono}</span><h4>${f.nombre}</h4><p>${f.descripcion}</p><span class="precio-tag">Desde ${f.minPuestos} puestos</span>`;
    cont.appendChild(div);
  });
}

function renderTelaCards(){
  const cont = document.getElementById("cz-tela-grid");
  if(!cont) return;
  cont.innerHTML = "";
  const s = state.servicio ? CONFIG.servicios[state.servicio] : null;
  Object.entries(CONFIG.telas).forEach(([id, t]) => {
    const div = document.createElement("div");
    div.className = "cz-option-card";
    div.dataset.tela = id;
    let nota;
    if(t.requiereCotizacion){
      nota = "Un asesor te cotiza el valor";
    } else if(s){
      nota = `${formatoCOP(s.precioPorPuesto * t.multiplicador)} / puesto`;
    } else {
      nota = "Elige un servicio primero";
    }
    const chipStyle = t.foto ? ` style="background-image:url('${t.foto}');background-size:cover;background-position:center;"` : "";
    const chipClass = t.foto ? "cz-tela-chip-mini" : `cz-tela-chip-mini ${t.patternClass}`;
    div.innerHTML = `<span class="${chipClass}"${chipStyle}></span><h4>${t.nombre}</h4><p>${nota}</p>`;
    cont.appendChild(div);
  });
  const telaCard = document.querySelector(`[data-tela="${state.telaId}"]`);
  if(telaCard) telaCard.classList.add("activo");
}

function renderColorSwatches(){
  const cont = document.getElementById("cz-color-grid");
  if(!cont) return;
  cont.innerHTML = "";
  CONFIG.colores.forEach(c => {
    const div = document.createElement("div");
    div.className = "cz-color-swatch";
    div.dataset.color = c.id;
    div.style.background = c.hex;
    div.title = c.nombre;
    cont.appendChild(div);
  });
}

function renderSelectsFromConfig(){
  const maderaSel = document.getElementById("cz-madera");
  if(!maderaSel) return;
  CONFIG.maderas.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.id; opt.textContent = m.nombre;
    maderaSel.appendChild(opt);
  });
  const pataSel = document.getElementById("cz-pata");
  if(!pataSel) return;
  CONFIG.patas.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id; opt.textContent = p.nombre;
    pataSel.appendChild(opt);
  });
}

function renderTransporteInfo(){
  const el = document.getElementById("cz-transporte-desglose");
  if(!el) return;
  if(!state.servicio){
    el.innerHTML = `<span>Elige un servicio primero.</span>`;
    return;
  }
  const valor = CONFIG.addons.transporte[state.servicio];
  const detalleTxt = state.servicio === "retapizado_premium"
    ? "Incluye recogida de tu mueble actual y entrega del resultado final."
    : "Incluye solo la entrega — no hay nada que recoger.";
  if(state.transporte){
    el.innerHTML = `<span>${detalleTxt}</span><span class="tot">Costo del transporte: ${formatoCOP(valor)}</span>`;
  } else {
    el.innerHTML = `<span>Transporte desactivado — puedes activarlo de nuevo cuando quieras.</span>`;
  }
}

function marcarSeleccionesPorDefecto(){
  const telaCard = document.querySelector(`[data-tela="${state.telaId}"]`);
  if(telaCard) telaCard.classList.add("activo");
  const colorSwatch = document.querySelector(`[data-color="${state.colorId}"]`);
  if(colorSwatch) colorSwatch.classList.add("activo");
  const formaCard = document.querySelector(`[data-forma="${state.forma}"]`);
  if(formaCard) formaCard.classList.add("activo");
  actualizarNotaPuestos();
}

/* ============================================================
   UTILIDADES
   ============================================================ */
function formatoCOP(valor){
  return "$" + Math.round(valor).toLocaleString("es-CO");
}
function actualizarNotaPuestos(){
  const min = CONFIG.formas[state.forma].minPuestos;
  const note = document.getElementById("cz-puestos-min-note");
  if(note) note.textContent = `Mínimo ${min} puestos para esta forma (la chaise/laterales ya están incluidos en ese total).`;
}

/* ============================================================
   REPARTO DE PUESTOS ENTRE TRAMOS (recto / chaise / laterales)
   — se sigue usando para el resumen y el mensaje de WhatsApp,
   aunque la vista previa ya no dibuje los tramos por separado.
   ============================================================ */
function distribuirPuestos(){
  const n = state.puestos;
  if(state.forma === "l"){
    const chaise = CONFIG.formas.l.puestosChaise;
    return { main: Math.max(n - chaise, 1), chaise };
  }
  if(state.forma === "u"){
    const lateral = CONFIG.formas.u.puestosLateral;
    return { main: Math.max(n - lateral * 2, 1), left: lateral, right: lateral };
  }
  return { main: n };
}

/* ============================================================
   CÁLCULO DE PRECIO
   ============================================================ */
function calcularPrecio(){
  if(!state.servicio) return null;

  const tela = CONFIG.telas[state.telaId];
  if(tela.requiereCotizacion){
    return { requiereCotizacion: true, telaNombre: tela.nombre };
  }

  const n = state.puestos;
  const forma = CONFIG.formas[state.forma];
  const s = CONFIG.servicios[state.servicio];
  const detalle = [];

  const precioPorPuesto = s.precioPorPuesto * tela.multiplicador;
  detalle.push({ label: `Precio por puesto (${s.nombre} — ${tela.nombre})`, valor: precioPorPuesto });
  const base = precioPorPuesto * n;
  detalle.push({ label: `Subtotal — ${s.nombre}, ${forma.nombre}, ${n} puestos`, valor: base });

  let addonsTotal = 0;

  if(state.servicio === "sala_nueva" && state.puff){
    addonsTotal += CONFIG.addons.puffAdicional;
    detalle.push({ label: "Puff adicional a juego", valor: CONFIG.addons.puffAdicional });
  }
  if(state.cojinesDecorativos > 0){
    const v = CONFIG.addons.cojinDecorativo * state.cojinesDecorativos;
    addonsTotal += v;
    detalle.push({ label: `${state.cojinesDecorativos} cojín(es) decorativo(s)`, valor: v });
  }
  if(state.transporte){
    const transporteValor = CONFIG.addons.transporte[state.servicio];
    addonsTotal += transporteValor;
    const transporteLabel = state.servicio === "retapizado_premium" ? "Transporte (recogida y entrega)" : "Transporte (entrega)";
    detalle.push({ label: transporteLabel, valor: transporteValor });
  }

  const subtotal = base + addonsTotal;

  let descuentoPct = 0;
  CONFIG.descuentoVolumen.forEach(d => { if(n >= d.minPuestos) descuentoPct = Math.max(descuentoPct, d.descuento); });
  const descuentoValor = subtotal * descuentoPct;
  const total = subtotal - descuentoValor;

  return { detalle, subtotal, descuentoPct, descuentoValor, total };
}

/* ============================================================
   VISTA PREVIA — FOTO REAL DEL SOFÁ + TINTE DE COLOR/TEXTURA
   ============================================================
   Solo existen fotos reales para 3 tamaños por forma (chico /
   mediano / grande) y 2 estilos de pata (madera_conica / metalica).
   getSofaVariante() elige, de esas 3, la más cercana al número de
   puestos actual. Si agregas más fotos (más tamaños), solo agrega
   entradas a SOFA_VARIANTES — no hay que tocar el resto del código.

   ⚠️ AVISO IMPORTANTE:
   - En "En L" el mínimo real es 5 puestos y en "En U" es 7, pero las
     fotos disponibles solo llegan hasta l-5 y arrancan en u-5. Por
     eso, hoy en día, subir puestos en L (5→10) o en U (7 en
     adelante) NO cambia la foto — siempre se ve la más grande
     disponible (l-5 / u-9 según corresponda). El precio sí sigue
     cambiando correctamente con cada puesto. Para que la foto
     también cambie en esos rangos, hacen falta más fotos (ej.
     l-6, l-7, l-8... y u-8, u-10) en el mismo estilo y ángulo.
   - El contador de "cojines decorativos" ya no se dibuja sobre la
     foto (antes se veía en el SVG). Sigue sumando al precio y
     aparece en el resumen y en el mensaje de WhatsApp.
   ============================================================ */
const SOFA_VARIANTES = {
  recto: [ { puestos: 2, key: "recto-2" }, { puestos: 3, key: "recto-3" }, { puestos: 4, key: "recto-4" } ],
  l:     [ { puestos: 3, key: "l-3" },     { puestos: 4, key: "l-4" },     { puestos: 5, key: "l-5" } ],
  u:     [ { puestos: 5, key: "u-5" },     { puestos: 7, key: "u-7" },     { puestos: 9, key: "u-9" } ]
};

function getSofaVariante(forma, puestos){
  const variantes = SOFA_VARIANTES[forma] || SOFA_VARIANTES.recto;
  let mejor = variantes[0];
  let mejorDiff = Math.abs(puestos - mejor.puestos);
  variantes.forEach(v => {
    const diff = Math.abs(puestos - v.puestos);
    if(diff < mejorDiff){ mejor = v; mejorDiff = diff; }
  });
  return mejor;
}

function getSofaFotoPath(forma, puestos, pataId){
  const variante = getSofaVariante(forma, puestos);
  return `img/sofas/${pataId}-${variante.key}.png`;
}

function renderPreview(){
  const fotoPath = getSofaFotoPath(state.forma, state.puestos, state.pataId);
  const img = document.getElementById("cz-sofa-foto");
  const textura = document.getElementById("cz-sofa-textura");
  const tinte = document.getElementById("cz-sofa-tinte");
  if(!img || !textura || !tinte) return;

  const forma = CONFIG.formas[state.forma];
  if(img.getAttribute("src") !== fotoPath){
    img.src = fotoPath;
  }
  img.alt = `Sofá ${forma.nombre}, ${state.puestos} puestos`;

  // La textura y el tinte se recortan con la silueta de esta misma
  // foto (mask-image), así el color solo se aplica sobre el sofá.
  const maskUrl = `url('${fotoPath}')`;
  textura.style.webkitMaskImage = maskUrl;
  textura.style.maskImage = maskUrl;
  tinte.style.webkitMaskImage = maskUrl;
  tinte.style.maskImage = maskUrl;

  const tela = CONFIG.telas[state.telaId];
  if(tela.foto){
    textura.style.backgroundImage = `url('${tela.foto}')`;
    textura.style.display = "block";
  } else {
    textura.style.backgroundImage = "";
    textura.style.display = "none";
  }

  const color = CONFIG.colores.find(c => c.id === state.colorId) || CONFIG.colores[0];
  tinte.style.backgroundColor = color.hex;

  const chip = document.getElementById("cz-tela-chip");
  if(chip){
    if(tela.foto){
      chip.className = "cz-tela-chip";
      chip.style.backgroundImage = `url('${tela.foto}')`;
    } else {
      chip.className = "cz-tela-chip " + tela.patternClass;
      chip.style.backgroundImage = "";
    }
  }
  const nombreEl = document.getElementById("cz-tela-nombre");
  if(nombreEl) nombreEl.textContent = tela.nombre;
}

/* ============================================================
   RENDER DE PRECIO EN VIVO
   ============================================================ */
function renderPrecioLive(){
  const val = document.getElementById("cz-price-val");
  if(!val) return;
  const r = calcularPrecio();
  const valMobile = document.getElementById("cz-price-val-mobile");
  if(!r){
    val.textContent = "— elige un servicio —";
    if(valMobile) valMobile.textContent = "—";
    return;
  }
  if(r.requiereCotizacion){
    val.textContent = "Por cotizar con un asesor";
    if(valMobile) valMobile.textContent = "Por cotizar";
    return;
  }
  val.textContent = formatoCOP(r.total);
  if(valMobile) valMobile.textContent = formatoCOP(r.total);
}

/* ============================================================
   WIZARD — NAVEGACIÓN
   ============================================================ */
function irAPaso(index){
  const first = document.getElementById(`step-${STEP_IDS[0]}`);
  if(!first) return;
  currentStep = index;
  STEP_IDS.forEach((id, i) => {
    document.getElementById(`step-${id}`).classList.toggle("activo", i === index);
    const pill = document.getElementById(`pill-${id}`);
    pill.classList.toggle("activo", i === index);
    pill.classList.toggle("completo", i < index);
  });
  document.getElementById("cz-btn-prev").disabled = index === 0;
  document.getElementById("cz-btn-next").style.display = index === STEP_IDS.length - 1 ? "none" : "inline-flex";
  if(index === STEP_IDS.length - 1) renderResumen();
  window.scrollTo({ top: document.getElementById("cotizador-top").offsetTop - 90, behavior: "smooth" });
}

function siguientePaso(){
  if(currentStep === 0 && !state.servicio) return;
  ajustarCamposPorServicio();
  if(currentStep < STEP_IDS.length - 1) irAPaso(currentStep + 1);
}
function pasoAnterior(){
  if(currentStep > 0) irAPaso(currentStep - 1);
}

function ajustarCamposPorServicio(){
  const esSala = state.servicio === "sala_nueva";
  const esRetapizado = state.servicio === "retapizado_premium";
  const a = document.getElementById("bloque-incluye-siempre");
  const b = document.getElementById("bloque-sala-nueva");
  if(a) a.style.display = esRetapizado ? "block" : "none";
  if(b) b.style.display = esSala ? "block" : "none";
}

/* ============================================================
   RESUMEN FINAL
   ============================================================ */
function renderResumen(){
  const cont = document.getElementById("cz-resumen-detalle");
  if(!cont) return;
  const r = calcularPrecio();
  const badges = document.getElementById("cz-resumen-badges");
  cont.innerHTML = "";
  badges.innerHTML = "";
  if(!r) return;

  const forma = CONFIG.formas[state.forma];
  const tela = CONFIG.telas[state.telaId];
  const color = CONFIG.colores.find(c => c.id === state.colorId);

  const chipsInfo = [`${state.puestos} puestos`, forma.nombre, tela.nombre, color.nombre];
  if(state.servicio === "sala_nueva"){
    chipsInfo.push(CONFIG.maderas.find(m => m.id === state.maderaId).nombre);
    chipsInfo.push(CONFIG.patas.find(p => p.id === state.pataId).nombre);
  }
  chipsInfo.forEach(txt => {
    const b = document.createElement("span");
    b.className = "cz-badge";
    b.textContent = txt;
    badges.appendChild(b);
  });

  if(r.requiereCotizacion){
    const nota = document.createElement("div");
    nota.className = "cz-nota-cotizacion";
    nota.textContent = "Un asesor de Carpincon Premium cotizará el valor según la tela seleccionada. Los demás detalles de tu configuración ya quedaron guardados para el asesor.";
    cont.appendChild(nota);
  } else {
    r.detalle.forEach(item => {
      const row = document.createElement("div");
      row.className = "cz-summary-row";
      row.innerHTML = `<span>${item.label}</span><span>${formatoCOP(item.valor)}</span>`;
      cont.appendChild(row);
    });
    if(r.descuentoPct > 0){
      const row = document.createElement("div");
      row.className = "cz-summary-row descuento";
      row.innerHTML = `<span>Descuento por volumen (${Math.round(r.descuentoPct * 100)}%)</span><span>-${formatoCOP(r.descuentoValor)}</span>`;
      cont.appendChild(row);
    }
    const totalRow = document.createElement("div");
    totalRow.className = "cz-summary-row total";
    totalRow.innerHTML = `<span>Total aproximado</span><span>${formatoCOP(r.total)}</span>`;
    cont.appendChild(totalRow);
  }

  document.getElementById("cz-garantia").textContent = `${CONFIG.garantiaMeses} meses de garantía`;
  document.getElementById("cz-tiempo").textContent = `Entrega estimada: ${CONFIG.tiempoEntregaDiasHabiles[state.servicio]} días hábiles`;
  document.getElementById("cz-wa-btn").href = construirMensajeWhatsApp(r);
}

function construirMensajeWhatsApp(r){
  const s = CONFIG.servicios[state.servicio];
  const tela = CONFIG.telas[state.telaId];
  const color = CONFIG.colores.find(c => c.id === state.colorId);
  const forma = CONFIG.formas[state.forma];

  let lineas = [
    "Hola, quiero enviar esta cotización generada en el cotizador web:",
    "",
    `Servicio: ${s.nombre}`,
    `Forma: ${forma.nombre} — ${state.puestos} puestos`,
    `Tela: ${tela.nombre}`,
    `Color: ${color.nombre}`
  ];
  if(state.servicio === "sala_nueva"){
    const madera = CONFIG.maderas.find(m => m.id === state.maderaId);
    const pata = CONFIG.patas.find(p => p.id === state.pataId);
    lineas.push(`Madera: ${madera.nombre}`, `Patas: ${pata.nombre}`);
    if(state.puff) lineas.push("Puff adicional a juego: sí");
  }
  if(state.cojinesDecorativos > 0) lineas.push(`Cojines decorativos: ${state.cojinesDecorativos}`);
  if(state.ubicacion) lineas.push(`Ubicación de entrega: ${state.ubicacion}`);

  if(r.requiereCotizacion){
    lineas.push("", "Elegí 'Otra tela' — por favor confírmenme el precio según la tela que quiero usar.");
  } else {
    lineas.push("", `Total aproximado: ${formatoCOP(r.total)}`, "", "¿Podemos confirmar los detalles?");
  }

  const texto = encodeURIComponent(lineas.join("\n"));
  return `https://wa.me/${CONFIG.whatsapp}?text=${texto}`;
}

/* ============================================================
   INICIALIZACIÓN DE CONTROLES
   ============================================================ */
function initServicioCards(){
  document.querySelectorAll("[data-servicio]").forEach(card => {
    card.addEventListener("click", () => {
      state.servicio = card.dataset.servicio;
      document.querySelectorAll("[data-servicio]").forEach(c => c.classList.remove("activo"));
      card.classList.add("activo");
      ajustarCamposPorServicio();
      renderTelaCards();
      renderTransporteInfo();
      renderPrecioLive();
    });
  });
}

function initFormaCards(){
  document.querySelectorAll("[data-forma]").forEach(card => {
    card.addEventListener("click", () => {
      state.forma = card.dataset.forma;
      document.querySelectorAll("[data-forma]").forEach(c => c.classList.remove("activo"));
      card.classList.add("activo");
      const min = CONFIG.formas[state.forma].minPuestos;
      if(state.puestos < min) state.puestos = min;
      document.getElementById("cz-puestos-num").textContent = state.puestos;
      actualizarNotaPuestos();
      renderPreview();
      renderPrecioLive();
    });
  });
}

function initContador(){
  const num = document.getElementById("cz-puestos-num");
  if(!num) return;
  document.getElementById("cz-puestos-menos").addEventListener("click", () => {
    const min = CONFIG.formas[state.forma].minPuestos;
    state.puestos = Math.max(min, state.puestos - 1);
    num.textContent = state.puestos;
    renderPreview(); renderPrecioLive();
  });
  document.getElementById("cz-puestos-mas").addEventListener("click", () => {
    state.puestos = Math.min(CONFIG.puestosMax, state.puestos + 1);
    num.textContent = state.puestos;
    renderPreview(); renderPrecioLive();
  });
}

function initTelaCards(){
  const cont = document.getElementById("cz-tela-grid");
  if(!cont) return;
  cont.addEventListener("click", (e) => {
    const card = e.target.closest("[data-tela]");
    if(!card) return;
    state.telaId = card.dataset.tela;
    document.querySelectorAll("[data-tela]").forEach(c => c.classList.remove("activo"));
    card.classList.add("activo");
    renderPreview(); renderPrecioLive();
  });
}

function initColores(){
  document.querySelectorAll("[data-color]").forEach(sw => {
    sw.addEventListener("click", () => {
      state.colorId = sw.dataset.color;
      document.querySelectorAll("[data-color]").forEach(c => c.classList.remove("activo"));
      sw.classList.add("activo");
      renderPreview();
    });
  });
}

function initToggles(){
  const map = { "toggle-puff": "puff", "toggle-transporte": "transporte" };
  Object.keys(map).forEach(id => {
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener("change", () => {
      state[map[id]] = el.checked;
      renderTransporteInfo();
      renderPrecioLive();
    });
  });
}

function initCojinesExtra(){
  const num = document.getElementById("cz-cojines-num");
  if(!num) return;
  document.getElementById("cz-cojines-menos").addEventListener("click", () => {
    state.cojinesDecorativos = Math.max(0, state.cojinesDecorativos - 1);
    num.textContent = state.cojinesDecorativos;
    renderPrecioLive();
  });
  document.getElementById("cz-cojines-mas").addEventListener("click", () => {
    state.cojinesDecorativos = Math.min(4, state.cojinesDecorativos + 1);
    num.textContent = state.cojinesDecorativos;
    renderPrecioLive();
  });
}

function initSelects(){
  const maderaSel = document.getElementById("cz-madera");
  if(maderaSel) maderaSel.addEventListener("change", () => { state.maderaId = maderaSel.value; });
  const pataSel = document.getElementById("cz-pata");
  if(pataSel) pataSel.addEventListener("change", () => { state.pataId = pataSel.value; renderPreview(); });
}

function initUbicacion(){
  const el = document.getElementById("cz-ubicacion");
  if(el) el.addEventListener("input", () => { state.ubicacion = el.value; });
}

function initNav(){
  const next = document.getElementById("cz-btn-next");
  if(!next) return;
  next.addEventListener("click", siguientePaso);
  document.getElementById("cz-btn-prev").addEventListener("click", pasoAnterior);
  document.querySelectorAll(".cz-step-pill").forEach((pill, i) => {
    pill.addEventListener("click", () => { if(i === 0 || state.servicio) irAPaso(i); });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderServicioCards();
  renderFormaCards();
  renderTelaCards();
  renderColorSwatches();
  renderSelectsFromConfig();
  renderTransporteInfo();
  marcarSeleccionesPorDefecto();

  initServicioCards();
  initFormaCards();
  initContador();
  initTelaCards();
  initColores();
  initToggles();
  initCojinesExtra();
  initSelects();
  initUbicacion();
  initNav();
  renderPreview();
  renderPrecioLive();
  if(document.getElementById("cotizador-top")) irAPaso(0);
});
