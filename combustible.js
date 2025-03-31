document.addEventListener('DOMContentLoaded', () => {
    const combustibleInicioCheckbox = document.getElementById('combustible-inicio');
    const detalleCombustibleDiv = document.getElementById('detalle-combustible');
    const formularioCombustible = document.getElementById('formulario-combustible');
    const litrosInicioInput = document.getElementById('litros-inicio');
    const montoInicioInput = document.getElementById('monto-inicio');

    combustibleInicioCheckbox.addEventListener('change', () => {
        detalleCombustibleDiv.style.display = combustibleInicioCheckbox.checked ? 'block' : 'none';
    });

    formularioCombustible.addEventListener('submit', (event) => {
        event.preventDefault();
        let gastoCombustibleInicial = 0;
        if (combustibleInicioCheckbox.checked) {
            const litros = parseFloat(litrosInicioInput.value);
            const monto = parseFloat(montoInicioInput.value);

            if (isNaN(litros) || litros <= 0) {
                alert('Por favor, ingrese una cantidad válida de litros.');
                return;
            }

            if (isNaN(monto) || monto <= 0) {
                alert('Por favor, ingrese un monto válido.');
                return;
            }
            gastoCombustibleInicial = monto;
            console.log('Combustible inicial registrado:', litros, 'litros por', monto, '$');
        } else {
            console.log('No se registró carga de combustible inicial.');
        }

        // Guardar el gasto de combustible en localStorage
        localStorage.setItem('combustibleInicial', JSON.stringify(gastoCombustibleInicial));

        alert('Información de combustible registrada. Redirigiendo a la página de inicio de jornada.');
        window.location.href = 'app.html';
    });
});
