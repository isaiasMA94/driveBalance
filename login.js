document.addEventListener('DOMContentLoaded', () => {
    const formularioLogin = document.getElementById('formulario-login');

    formularioLogin.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Aquí iría la lógica real de autenticación
        // Por ahora, simulamos un inicio de sesión exitoso
        console.log('Intento de inicio de sesión con:', { email, password });
        alert('Inicio de sesión exitoso (simulado). Redirigiendo a la página de carga de combustible.');
        window.location.href = 'combustible.html';
    });
});