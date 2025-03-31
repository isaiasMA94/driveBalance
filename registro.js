document.addEventListener('DOMContentLoaded', () => {
    const formularioRegistroConductor = document.getElementById('formulario-registro-conductor');
    const formularioRegistroAuto = document.getElementById('formulario-registro-auto');
    const verificationForm = document.getElementById('verification-form');

    formularioRegistroConductor.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nombre = document.getElementById('nombre-completo').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/api/conductores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, telefono, email, password })
            });

            if (response.ok) {
                formularioRegistroConductor.style.display = 'none';
                verificationForm.style.display = 'block';
                alert('Registro exitoso. Verifica tu correo.');
            } else {
                const data = await response.json();
                alert('Error al registrar: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al registrar.');
        }
    });

    verificationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const verificationCode = document.getElementById('verification-code').value;

        try {
            const response = await fetch('http://localhost:3000/api/conductores/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, verificationCode })
            });

            if (response.ok) {
                verificationForm.style.display = 'none';
                formularioRegistroAuto.style.display = 'block';
                alert('Cuenta verificada.');
            } else {
                const data = await response.json();
                alert('Error al verificar: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al verificar.');
        }
    });

    formularioRegistroAuto.addEventListener('submit', async (event) => {
        event.preventDefault();
        const patente = document.getElementById('patente').value;
        const marca = document.getElementById('marca').value;
        const modelo = document.getElementById('modelo').value;
        const año = document.getElementById('año').value;
        const color = document.getElementById('color').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const responseLogin = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            if (responseLogin.ok) {
                const dataLogin = await responseLogin.json();
                const conductorId = dataLogin.conductorId;
                const response = await fetch('http://localhost:3000/api/autos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ patente, marca, modelo, año, color, conductorId })
                });

                if (response.ok) {
                    alert('Registro completado.');
                    window.location.href = 'combustible.html';
                } else {
                    const data = await response.json();
                    alert('Error al registrar auto: ' + data.error);
                }
            } else {
                const data = await responseLogin.json();
                alert('Error al iniciar sesion: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al registrar auto.');
        }
    });
});
