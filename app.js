// 1. Obtener el ID de la arqueta desde la URL (Ej: ?arqueta=A-001)
const urlParams = new URLSearchParams(window.location.search);
const arquetaId = urlParams.get('arqueta');

if(!arquetaId) {
    alert("Error: No se ha especificado la arqueta.");
}

// 2. Estado de la aplicación (El JSON que guardaremos)
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

// 3. Lógica para añadir un Conducto
document.getElementById('btn-add-conducto').addEventListener('click', () => {
    // Un formulario nativo simple (se puede hacer un modal HTML más bonito luego)
    let prisma = prompt("Prisma:");
    let diametro = prompt("Diámetro:");
    
    if(prisma && diametro) {
        crearElementoConducto(prisma, diametro, 50, 50); // Aparece en X:50, Y:50
    }
});

function crearElementoConducto(prisma, diametro, x, y) {
    const lienzo = document.getElementById('lienzo');
    const div = document.createElement('div');
    div.className = 'elemento-draggable';
    
    // Texto del conducto
    div.innerHTML = `○ ${prisma} ø${diametro}`;
    
    // Posición inicial
    div.style.transform = `translate(${x}px, ${y}px)`;
    div.setAttribute('data-x', x);
    div.setAttribute('data-y', y);
    div.setAttribute('data-prisma', prisma);
    div.setAttribute('data-diametro', diametro);
    
    lienzo.appendChild(div);
}

// 4. Configurar Interact.js para que se pueda arrastrar con el dedo
interact('.elemento-draggable').draggable({
    listeners: {
        move (event) {
            let target = event.target;
            // Mantener la posición arrastrada
            let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // Traducir el elemento
            target.style.transform = `translate(${x}px, ${y}px)`;

            // Actualizar los atributos para el siguiente movimiento
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
    }
});

// 5. Botón Guardar
document.getElementById('btn-guardar').addEventListener('click', () => {
    // Aquí recolectamos dónde está cada div y actualizamos "estadoLienzo"
    // Luego enviamos "estadoLienzo" al servidor (Fetch API hacia Google Apps Script o Firebase)
    console.log("JSON a guardar:", JSON.stringify(estadoLienzo));
    alert("Guardado correctamente");
});