document.getElementById('btn-guardar').addEventListener('click', () => {
    // 1. PEGA AQUÍ TU URL DE APPS SCRIPT
    const urlScript = "https://script.google.com/macros/s/AKfycbxV_e2__0A4icbrya5ErahfhCyNB4VWcRysKVubANKWZj83kgav2aGNIovUOejmzHL7/exec";

    // 2. Guardar el input actual de cables de la cara visible
    estadoLienzo.caras[caraActual].cables_totales = document.getElementById('cables-totales').value;

    // 3. Limpiar y reconstruir los elementos leyendo la pantalla
    for(let i=1; i<=4; i++) estadoLienzo.caras[i].elementos = [];

    document.querySelectorAll('.elemento-draggable').forEach(el => {
        let c = parseInt(el.getAttribute('data-cara'));
        estadoLienzo.caras[c].elementos.push({
            prisma: el.getAttribute('data-prisma'),
            diametro: el.getAttribute('data-diametro'),
            x: el.getAttribute('data-x'),
            y: el.getAttribute('data-y')
        });
    });

    // 4. Enviar a Google
    let btn = document.getElementById('btn-guardar');
    btn.innerText = "Guardando...";

    fetch(urlScript, {
        method: 'POST',
        mode: 'no-cors', // Evita errores de política cruzada desde GitHub
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estadoLienzo)
    })
    .then(() => {
        alert("¡Guardado correctamente en la base de datos!");
        btn.innerText = "GUARDAR";
    })
    .catch(err => {
        alert("Error de conexión al guardar.");
        btn.innerText = "GUARDAR";
    });
});
