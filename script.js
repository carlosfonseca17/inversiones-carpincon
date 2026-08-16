// ================================
// 📱 WHATSAPP
// ================================
const telefono = "573246884807";
const mensajeBase = "Hola, estoy interesado en un producto de carpintería Carpincon";

const btnWhatsapp = document.getElementById("whatsapp");
if (btnWhatsapp) {
    btnWhatsapp.href = `https://wa.me/${telefono}?text=${encodeURIComponent(mensajeBase)}`;
}

// ================================
// 📩 FORMULARIO (si existe en la página)
// ================================
const formulario = document.getElementById("formulario");
if (formulario) {
    formulario.addEventListener("submit", async function (e) {
        e.preventDefault();

        const boton = formulario.querySelector("button");
        const error = document.getElementById("mensaje-error");
        if (error) error.style.display = "none";

        if (!boton) return;
        boton.disabled = true;
        boton.innerText = "Enviando...";

        const campoNombre = document.getElementById("nombre");
        const campoCorreo = document.getElementById("correo");
        const campoTelefono = document.getElementById("telefono");
        const campoMensaje = document.getElementById("mensaje");
        const campoOrigen = document.getElementById("origen");

        const datos = {
            nombre: campoNombre ? campoNombre.value : "",
            correo: campoCorreo ? campoCorreo.value : "",
            telefono: campoTelefono ? campoTelefono.value : "",
            mensaje: campoMensaje ? campoMensaje.value : "",
            origen: campoOrigen ? campoOrigen.value : "web"
        };

try {
    const respuesta = await fetch(
        "https://script.google.com/macros/s/AKfycbzY6MaV8Wu9jyUw_fjqSTDATQFvn75ba9usZKOsQg2C5IqHjdMjXx_coaWzY72Pr6Tx/exec",
        {
            method: "POST",
            // No pongas 'Content-Type': el navegador usará application/x-www-form-urlencoded automáticamente
            body: new URLSearchParams(datos)
        }
    );

    const data = await respuesta.text();
    console.log("Respuesta servidor:", data);

    if (data.trim() === "OK") {
        window.location.href = "gracias.html";
    } else {
        throw new Error("Respuesta inesperada del servidor");
    }
} catch (err) {
    console.error(err);
    if (error) error.style.display = "block";
} finally {
    if (window.location.href.indexOf("gracias.html") === -1) {
        boton.disabled = false;
        boton.innerText = "Enviar solicitud";
    }
}
    }); // ← Cierre del addEventListener
} // ← Cierre del if(formulario)

// ================================
// 🖼️ GALERÍA DE IMÁGENES
// ================================
let imagenesActuales = [];
let indiceActual = 0;
let medidaSeleccionada = null;   // { etiqueta, precio }
let maderaSeleccionada = null;   // string
const linkWhatsApp = document.getElementById("whatsapp-consulta");

function actualizarImagenModal() {
    const img = document.getElementById("modal-imagen");
    if (img && imagenesActuales.length > 0) {
        img.src = imagenesActuales[indiceActual];
    }
}

window.cambiarImagen = function (direccion) {
    if (imagenesActuales.length <= 1) return;

    indiceActual += direccion;
    if (indiceActual >= imagenesActuales.length) indiceActual = 0;
    else if (indiceActual < 0) indiceActual = imagenesActuales.length - 1;

    actualizarImagenModal();
};

// Al hacer clic en la imagen también avanza
document.getElementById("modal-imagen")?.addEventListener("click", function () {
    if (imagenesActuales.length > 1) cambiarImagen(1);
});

// ================================
// 📐 GENERAR OPCIONES DE MEDIDA Y MADERA
// ================================
function generarOpciones(medidas, maderas) {
    const contMedidas = document.getElementById("contenedor-medidas");
    const contMaderas = document.getElementById("contenedor-maderas");

    if (contMedidas) contMedidas.innerHTML = "";
    if (contMaderas) contMaderas.innerHTML = "";

    // Botones de medidas
    medidas.forEach(med => {
        const btn = document.createElement("button");
        btn.className = "btn-medida";
        btn.textContent = `${med.etiqueta} - ${med.precio}`;
        btn.addEventListener("click", function () {
            document.querySelectorAll(".btn-medida").forEach(b => b.classList.remove("seleccionado"));
            this.classList.add("seleccionado");
            medidaSeleccionada = med;
            actualizarMensajeWhatsApp();
        });
        if (contMedidas) contMedidas.appendChild(btn);
    });

    // Botones de maderas
    maderas.forEach(mad => {
        const btn = document.createElement("button");
        btn.className = "btn-madera";
        btn.textContent = mad;
        btn.addEventListener("click", function () {
            document.querySelectorAll(".btn-madera").forEach(b => b.classList.remove("seleccionado"));
            this.classList.add("seleccionado");
            maderaSeleccionada = mad;
            actualizarMensajeWhatsApp();
        });
        if (contMaderas) contMaderas.appendChild(btn);
    });
}

function actualizarMensajeWhatsApp() {
    if (!linkWhatsApp) return;

    const titulo = document.getElementById("modal-titulo")?.textContent || "Producto";
    const medidaTxt = medidaSeleccionada
        ? `${medidaSeleccionada.etiqueta} (${medidaSeleccionada.precio})`
        : "Medida no especificada";
    const maderaTxt = maderaSeleccionada || "Madera no especificada";

    const mensaje = `Hola, estoy interesado en el producto "${titulo}", medida: ${medidaTxt}, tipo de madera: ${maderaTxt}`;
    linkWhatsApp.href = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
}

// ================================
// 🪟 MODAL
// ================================
window.abrirModal = function (producto = null) {
    const modal = document.getElementById("modal");
    if (!modal) return;

    if (producto) {
        // Imágenes
        let listaImagenes = [];
        if (producto.imagenes && Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
            listaImagenes = producto.imagenes;
        } else if (producto.imagen && typeof producto.imagen === 'string') {
            listaImagenes = [producto.imagen];
        } else {
            listaImagenes = ['img/comedor1.jpg'];
        }
        imagenesActuales = listaImagenes;
        indiceActual = 0;
        actualizarImagenModal();

        const flechaIzq = document.getElementById('flecha-izquierda');
        const flechaDer = document.getElementById('flecha-derecha');
        if (flechaIzq && flechaDer) {
            if (imagenesActuales.length <= 1) {
                flechaIzq.classList.add('oculta');
                flechaDer.classList.add('oculta');
            } else {
                flechaIzq.classList.remove('oculta');
                flechaDer.classList.remove('oculta');
            }
        }

        // Textos
        const cat = document.getElementById("modal-categoria");
        const tit = document.getElementById("modal-titulo");
        const sub = document.getElementById("modal-subtitulo");
        if (cat) cat.textContent = producto.categoria;
        if (tit) tit.textContent = producto.titulo;
        if (sub) sub.textContent = producto.subtitulo;

        // Opciones dinámicas
        const medidas = producto.medidas || [];
        const maderas = producto.maderas || [];
        generarOpciones(medidas, maderas);

        // Resetear selección
        medidaSeleccionada = null;
        maderaSeleccionada = null;
    }

    actualizarMensajeWhatsApp(); // actualiza con valores por defecto

    modal.style.display = "flex";
    const contenido = modal.querySelector(".contenido-modal");
    if (contenido) contenido.classList.remove("cerrar-modal");
};

window.cerrarModal = function () {
    const modal = document.getElementById("modal");
    if (!modal) return;
    if (modal.style.display === "none") return;

    const contenido = modal.querySelector(".contenido-modal");
    if (contenido) {
        contenido.classList.add("cerrar-modal");
        setTimeout(() => {
            modal.style.display = "none";
            contenido.classList.remove("cerrar-modal");
        }, 300);
    } else {
        modal.style.display = "none";
    }
};

window.addEventListener("click", function (event) {
    const modal = document.getElementById("modal");
    if (modal && event.target === modal) {
        window.cerrarModal();
    }
});

// ================================
// 📍 IR A SECCIÓN
// ================================
window.irSeccion = function (id) {
    const seccion = document.getElementById(id);
    if (seccion) seccion.scrollIntoView({ behavior: "smooth" });
};

// ================================
// 🔍 BUSCADOR
// ================================
window.buscarProducto = function () {
    const input = document.getElementById("busqueda");
    if (!input) return;

    const termino = input.value.toLowerCase();
    const productos = document.querySelectorAll(".card-producto");

    productos.forEach(producto => {
        const nombreElem = producto.querySelector(".nombre-producto");
        if (!nombreElem) return;

        const nombre = nombreElem.textContent.toLowerCase();
        if (nombre.includes(termino)) {
            producto.classList.remove("oculto");
        } else {
            producto.classList.add("oculto");
        }
    });
};

console.log("✅ script.js cargado correctamente");
