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

function actualizarVistaCara() {
    tituloCara.innerText = `Cara ${caraActual} / 4`;
    // Aquí defines la ruta a la imagen de fondo correspondiente a cada cara
    lienzo.style.backgroundImage = `url('plantilla_cara${caraActual}.png')`;
    
    // Ocultar todos los conductos y mostrar solo los de la cara actual
    document.querySelectorAll('.elemento-draggable').forEach(el => {
        el.style.display = (parseInt(el.getAttribute('data-cara')) === caraActual) ? 'inline-flex' : 'none';
    });
}

document.getElementById('btn-prev').addEventListener('click', () => {
    if (caraActual > 1) { caraActual--; actualizarVistaCara(); }
});

document.getElementById('btn-next').addEventListener('click', () => {
    if (caraActual < 4) { caraActual++; actualizarVistaCara(); }
});

document.getElementById('btn-add-conducto').addEventListener('click', () => {
    let prisma = prompt("Prisma:");
    let diametro = prompt("Diámetro:");
    if(prisma && diametro) crearElementoConducto(prisma, diametro, 50, 50);
});

function crearElementoConducto(prisma, diametro, x, y) {
    const div = document.createElement('div');
    div.className = 'elemento-draggable';
    div.innerHTML = `○ ${prisma} ø${diametro}`;
    div.style.transform = `translate(${x}px, ${y}px)`;
    
    div.setAttribute('data-x', x);
    div.setAttribute('data-y', y);
    div.setAttribute('data-prisma', prisma);
    div.setAttribute('data-diametro', diametro);
    div.setAttribute('data-cara', caraActual); // Asociamos el conducto a la cara actual
    
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

actualizarVistaCara(); // Cargar la Cara 1 al iniciar
