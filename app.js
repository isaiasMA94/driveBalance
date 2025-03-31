document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const iniciarJornadaBtn = document.getElementById('iniciar-jornada');
    const inicioJornadaInfo = document.getElementById('inicio-jornada-info');
    const fechaInicioSpan = document.getElementById('fecha-inicio');
    const horaInicioSpan = document.getElementById('hora-inicio');
    const finalizarJornadaBtn = document.getElementById('finalizar-jornada');
    const finJornadaInfo = document.getElementById('fin-jornada-info');
    const fechaFinSpan = document.getElementById('fecha-fin');
    const horaFinSpan = document.getElementById('hora-fin');
    const nuevoViajeBtn = document.getElementById('nuevo-viaje');
    const listaViajesDiv = document.getElementById('lista-viajes');
    const balanceJornadaSection = document.getElementById('balance-jornada');
    const totalViajesSpan = document.getElementById('total-viajes');
    const totalRecaudadoSpan = document.getElementById('total-recaudado');
    const viajesEfectivoSpan = document.getElementById('viajes-efectivo');
    const viajesTransferenciaSpan = document.getElementById('viajes-transferencia');
    const viajesAppSpan = document.getElementById('viajes-app');
    const gastoCombustibleSpan = document.getElementById('gasto-combustible');
    const gananciaNetaSpan = document.getElementById('ganancia-neta');
    const verViajesBtn = document.getElementById('ver-viajes');
    const viajesContainer = document.getElementById('viajes-container');

    let jornadaIniciada = false;
    let inicioJornada;
    let viajes = [];
    let gastoCombustibleInicial = 0;
    let conductorId;

    // --- Funciones para guardar y cargar datos de localStorage ---
    function guardarDatos() {
        localStorage.setItem('jornadaIniciada', JSON.stringify(jornadaIniciada));
        localStorage.setItem('inicioJornada', inicioJornada ? inicioJornada.toISOString() : null);
        localStorage.setItem('viajes', JSON.stringify(viajes));
    }

    function cargarDatos() {
        const jornadaGuardada = localStorage.getItem('jornadaIniciada');
        if (jornadaGuardada) {
            jornadaIniciada = JSON.parse(jornadaGuardada);
        }
        const inicioGuardado = localStorage.getItem('inicioJornada');
        if (inicioGuardado) {
            inicioJornada = new Date(inicioGuardado);
            fechaInicioSpan.textContent = inicioJornada.toLocaleDateString();
            horaInicioSpan.textContent = inicioJornada.toLocaleTimeString();
            inicioJornadaInfo.style.display = 'block';
            iniciarJornadaBtn.disabled = true;
            finalizarJornadaBtn.disabled = !jornadaIniciada;
            iniciarJornadaBtn.textContent = 'Finalizar Jornada';
            iniciarJornadaBtn.classList.add('fin-jornada');
        }
        const viajesGuardados = localStorage.getItem('viajes');
        if (viajesGuardados) {
            viajes = JSON.parse(viajesGuardados);
            actualizarListaViajes();
            if (jornadaIniciada && viajes.length > 0) {
                balanceJornadaSection.style.display = 'none'; // Ocultar si se cargan viajes y la jornada está activa
            }
        }
        const combustibleGuardado = localStorage.getItem('combustibleInicial');
        if (combustibleGuardado) {
            gastoCombustibleInicial = parseFloat(combustibleGuardado);
            gastoCombustibleSpan.textContent = gastoCombustibleInicial.toFixed(2);
        }
        if (jornadaIniciada && inicioGuardado) {
            finalizarJornadaBtn.disabled = false;
        }
        if (jornadaIniciada && viajes.length > 0 && !finalizarJornadaBtn.disabled) {
            mostrarBalance();
        }
    }

    cargarDatos(); // Cargar datos al iniciar la página

    // --- Inicio de Jornada ---
    if (iniciarJornadaBtn) {
        iniciarJornadaBtn.addEventListener('click', () => {
            if (!jornadaIniciada) {
                jornadaIniciada = true;
                inicioJornada = new Date();
                fechaInicioSpan.textContent = inicioJornada.toLocaleDateString();
                horaInicioSpan.textContent = inicioJornada.toLocaleTimeString();
                inicioJornadaInfo.style.display = 'block';
                iniciarJornadaBtn.disabled = true;
                finalizarJornadaBtn.disabled = false;
                guardarDatos();
                iniciarJornadaBtn.textContent = 'Finalizar Jornada';
                iniciarJornadaBtn.classList.add('fin-jornada');
            } else {
                const finJornada = new Date();
                fechaFinSpan.textContent = finJornada.toLocaleDateString();
                horaFinSpan.textContent = finJornada.toLocaleTimeString();
                finJornadaInfo.style.display = 'block';
                finalizarJornadaBtn.disabled = true;
                mostrarBalance();
                jornadaIniciada = false;
                guardarDatos(); // Guardar al finalizar la jornada
                iniciarJornadaBtn.textContent = 'Iniciar Jornada';
                iniciarJornadaBtn.classList.remove('fin-jornada');
                iniciarJornadaBtn.disabled = false;
            }
        });
    }

    // --- Registro de Viajes ---
    if (nuevoViajeBtn) {
        nuevoViajeBtn.addEventListener('click', () => {
            if (jornadaIniciada) {
                mostrarFormularioNuevoViaje();
            } else {
                alert('Por favor, inicia la jornada laboral primero.');
            }
        });
    }

    function mostrarFormularioNuevoViaje(viajeParaEditar = null, indexParaEditar = null) {
        const nuevoViajeDiv = document.createElement('div');
        nuevoViajeDiv.classList.add('viaje-registrado');

        const metodoPagoLabel = document.createElement('label');
        metodoPagoLabel.textContent = 'Método de Pago:';
        const metodoPagoSelect = document.createElement('select');
        metodoPagoSelect.innerHTML = `
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="app">Cuenta de la App</option>
        `;

        const montoLabel = document.createElement('label');
        montoLabel.textContent = 'Monto ($):';
        const montoInput = document.createElement('input');
        montoInput.type = 'number';
        montoInput.step = '0.01';

        if (viajeParaEditar) {
            metodoPagoSelect.value = viajeParaEditar.metodoPago;
            montoInput.value = viajeParaEditar.monto;
        }

        const guardarBtn = document.createElement('button');
        guardarBtn.textContent = viajeParaEditar ? 'Guardar Edición' : 'Guardar Viaje';
        guardarBtn.addEventListener('click', () => {
            const metodo = metodoPagoSelect.value;
            const montoViaje = parseFloat(montoInput.value);
            if (isNaN(montoViaje) || montoViaje <= 0) {
                alert('Por favor, ingrese un monto válido para el viaje.');
                return;
            }

            if (viajeParaEditar) {
                viajes[indexParaEditar] = { metodoPago: metodo, monto: montoViaje };
            } else {
                viajes.push({ metodoPago: metodo, monto: montoViaje });
            }
            actualizarListaViajes();
            nuevoViajeDiv.remove();
            guardarDatos(); // Guardar cada viaje registrado
        });

        const cancelarBtn = document.createElement('button');
        cancelarBtn.textContent = 'Cancelar';
        cancelarBtn.addEventListener('click', () => {
            nuevoViajeDiv.remove();
        });

        nuevoViajeDiv.appendChild(metodoPagoLabel);
        nuevoViajeDiv.appendChild(metodoPagoSelect);
        nuevoViajeDiv.appendChild(montoLabel);
        nuevoViajeDiv.appendChild(montoInput);
        nuevoViajeDiv.appendChild(guardarBtn);
        nuevoViajeDiv.appendChild(cancelarBtn);

        listaViajesDiv.appendChild(nuevoViajeDiv);
    }

    function actualizarListaViajes() {
        listaViajesDiv.innerHTML = '';
        viajes.forEach((viaje, index) => {
            const viajeInfo = document.createElement('div');
            viajeInfo.classList.add('viaje-registrado');
            viajeInfo.innerHTML = `
                <p>Viaje ${index + 1}: Método - ${viaje.metodoPago}, Monto - $${viaje.monto.toFixed(2)}</p>
                <button class="editar-viaje" data-index="${index}">Editar</button>
                <button class="eliminar-viaje" data-index="${index}">Eliminar</button>
            `;
            listaViajesDiv.appendChild(viajeInfo);
        });

        // Agregar listeners para los botones de editar y eliminar después de crear los elementos
        document.querySelectorAll('.editar-viaje').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                mostrarFormularioNuevoViaje(viajes[index], index);
            });
        });

        document.querySelectorAll('.eliminar-viaje').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (confirm('¿Seguro que desea eliminar este viaje?')) {
                    viajes.splice(index, 1);
                    actualizarListaViajes();
                    guardarDatos(); // Guardar después de eliminar
                    if (jornadaIniciada && viajes.length === 0) {
                        balanceJornadaSection.style.display = 'none';
                    } else if (jornadaIniciada) {
                        mostrarBalance();
                    }
                }
            });
        });
        if (jornadaIniciada && viajes.length > 0) {
            mostrarBalance();
        } else if (jornadaIniciada) {
            balanceJornadaSection.style.display = 'none';
        }
    }

    // --- Fin de Jornada ---
    if (finalizarJornadaBtn) {
        finalizarJornadaBtn.addEventListener('click', () => {
            if (jornadaIniciada) {
                const finJornada = new Date();
                fechaFinSpan.textContent = finJornada.toLocaleDateString();
                horaFinSpan.textContent = finJornada.toLocaleTimeString();
                finJornadaInfo.style.display = 'block';
                finalizarJornadaBtn.disabled = true;
                mostrarBalance();
                jornadaIniciada = false;
                guardarDatos(); // Guardar al finalizar la jornada
                iniciarJornadaBtn.textContent = 'Iniciar Jornada';
                iniciarJornadaBtn.classList.remove('fin-jornada');
                iniciarJornadaBtn.disabled = false;
            } else {
                alert('Por favor, inicia la jornada laboral primero.');
            }
        });
        finalizarJornadaBtn.disabled = true; // Inicialmente deshabilitado
    }

    // --- Mostrar Balance ---
    function mostrarBalance() {
        let totalRecaudado = 0;
        let efectivo = 0;
        let transferencia = 0;
        let app = 0;

        viajes.forEach(viaje => {
            totalRecaudado += viaje.monto;
            switch (viaje.metodoPago) {
                case 'efectivo':
                    efectivo++;
                    break;
                case 'transferencia':
                    transferencia++;
                    break;
                case 'app':
                    app++;
                    break;
            }
        });

        const totalViajes = viajes.length;
        const gananciaNeta = totalRecaudado - gastoCombustibleInicial;

        totalViajesSpan.textContent = totalViajes;
        totalRecaudadoSpan.textContent = totalRecaudado.toFixed(2);
        viajesEfectivoSpan.textContent = efectivo;
        viajesTransferenciaSpan.textContent = transferencia;
        viajesAppSpan.textContent = app;
        gastoCombustibleSpan.textContent = gastoCombustibleInicial.toFixed(2);
        gananciaNetaSpan.textContent = gananciaNeta.toFixed(2);

        balanceJornadaSection.style.display = 'block';
    }

    // --- Ver Viajes ---
    if (verViajesBtn) {
        verViajesBtn.addEventListener('click', () => {
            if (viajesContainer.style.display === 'none') {
                viajesContainer.style.display = 'block';
                verViajesBtn.textContent = 'Ocultar Viajes';
            } else {
                viajesContainer.style.display = 'none';
                verViajesBtn.textContent = 'Ver Viajes Realizados';
            }
        });
    }
});
