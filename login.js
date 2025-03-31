document.addEventListener('DOMContentLoaded', () => {
    const formularioLogin = document.getElementById('formulario-login');

    formularioLogin.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                alert('Inicio de sesión exitoso.');
                window.location.href = 'combustible.html';
            } else {
                const data = await response.json();
                alert('Error al iniciar sesión: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al iniciar sesión.');
        }
    });
});
