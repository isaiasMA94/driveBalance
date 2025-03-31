document.addEventListener('DOMContentLoaded', () => {
    const formularioRegistroConductor = document.getElementById('formulario-registro-conductor');
    const formularioRegistroAuto = document.getElementById('formulario-registro-auto');

    formularioRegistroConductor.addEventListener('submit', (event) => {
        event.preventDefault();
        const nombre = document.getElementById('nombre-completo').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;

        // Guardar datos del conductor en localStorage
        localStorage.setItem('conductor', JSON.stringify({ nombre, telefono, email }));

        formularioRegistroConductor.style.display = 'none';
        formularioRegistroAuto.style.display = 'block';
    });

    formularioRegistroAuto.addEventListener('submit', (event) => {
        event.preventDefault();
        const patente = document.getElementById('patente').value;
        const marca = document.getElementById('marca').value;
        const modelo = document.getElementById('modelo').value;
        const año = document.getElementById('año').value;
        const color = document.getElementById('color').value;

        // Guardar datos del automóvil en localStorage
        localStorage.setItem('auto', JSON.stringify({ patente, marca, modelo, año, color }));

        alert('Registro completado. Redirigiendo a la página de carga de combustible.');
        window.location.href = 'combustible.html';
    });
});