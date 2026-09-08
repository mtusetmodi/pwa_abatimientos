const urlParams = new URLSearchParams(window.location.search);
const arquetaId = urlParams.get('arqueta');

if(!arquetaId) alert("Error: No se ha especificado la arqueta.");

let estadoLienzo = {
    id_arqueta: arquetaId,
    caras: {
        1: { cables_totales: "", elementos: [] },
        2: { cables_totales: "", elementos: [] },
        3: { cables_totales: "", elementos: [] },
        4: { cables_totales: "", elementos: [] }
    }
};

let caraActual = 1;
const tituloCara = document.getElementById('titulo-cara');
const lienzo = document.getElementById('lienzo');
const inputCables = document.getElementById('cables-totales');

function actualizarVistaCara() {
    tituloCara.innerText = `Cara ${caraActual} / 4`;
    lienzo.style.backgroundImage = `url('plantilla_cara${caraActual}.png')`;
    
    // Cargar el texto de cables totales de esta cara
    inputCables.value = estadoLienzo.caras[caraActual].cables_totales || "";
    
    document.querySelectorAll('.elemento-draggable').forEach(el => {
        el.style.display = (parseInt(el.getAttribute('data-cara')) === caraActual) ? 'inline-flex' : 'none';
    });
}

// Guardar los cables de la cara actual si el usuario escribe algo
inputCables.addEventListener('change', (e) => {
    estadoLienzo.caras[caraActual].cables_totales = e.target.value;
});

document.getElementById('btn-prev').addEventListener('click', () => {
    if (caraActual > 1) { caraActual--; actualizarVistaCara(); }
});

document.getElementById('btn-next').addEventListener('click', () => {
    if (caraActual < 4) { caraActual++; actualizarVistaCara(); }
});

// Botón Conducto
document.getElementById('btn-add-conducto').addEventListener('click', () => {
    let prisma = prompt("Prisma:");
    let diametro = prompt("Diámetro:");
    if(prisma && diametro) crearElemento('conducto', `○ ${prisma} ø${diametro}`, 50, 50, prisma, diametro);
});

// Botón Texto (NUEVO)
document.getElementById('btn-add-texto').addEventListener('click', () => {
    let texto = prompt("Escribe tu nota:");
    if(texto) crearElemento('texto', texto, 50, 50, "", "");
});

function crearElemento(tipo, contenido, x, y, prisma, diametro) {
    const div = document.createElement('div');
    div.className = 'elemento-draggable';
    div.innerHTML = contenido;
    div.style.transform = `translate(${x}px, ${y}px)`;
    
    div.setAttribute('data-x', x);
    div.setAttribute('data-y', y);
    div.setAttribute('data-tipo', tipo); // Diferenciar si es texto o conducto
    div.setAttribute('data-prisma', prisma);
    div.setAttribute('data-diametro', diametro);
    div.setAttribute('data-cara', caraActual);
    
    lienzo.appendChild(div);
}

interact('.elemento-draggable').draggable({
    listeners: {
        move (event) {
            let target = event.target;
            let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
    }
});

document.getElementById('btn-guardar').addEventListener('click', () => {
    // 1. PEGA AQUÍ TU URL DE APPS SCRIPT ENTRE LAS COMILLAS
    const urlScript = "https://script.google.com/macros/s/AKfycbxV_e2__0A4icbrya5ErahfhCyNB4VWcRysKVubANKWZj83kgav2aGNIovUOejmzHL7/exec";

    estadoLienzo.caras[caraActual].cables_totales = inputCables.value;

    for(let i=1; i<=4; i++) estadoLienzo.caras[i].elementos = [];

    document.querySelectorAll('.elemento-draggable').forEach(el => {
        let c = parseInt(el.getAttribute('data-cara'));
        estadoLienzo.caras[c].elementos.push({
            tipo: el.getAttribute('data-tipo'),
            texto: el.innerHTML,
            prisma: el.getAttribute('data-prisma'),
            diametro: el.getAttribute('data-diametro'),
            x: el.getAttribute('data-x'),
            y: el.getAttribute('data-y')
        });
    });

    let btn = document.getElementById('btn-guardar');
    btn.innerText = "Guardando...";

    fetch(urlScript, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estadoLienzo)
    })
    .then(() => {
        alert("¡Guardado correctamente!");
        btn.innerText = "GUARDAR";
    })
    .catch(err => {
        alert("Error de conexión.");
        btn.innerText = "GUARDAR";
    });
});

actualizarVistaCara();
   
