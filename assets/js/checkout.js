// checkout.js - Funciones del checkout

// Configuración del comercio
const CONFIGURACION_COMERCIO = {
    direccionLocal: 'Mi casa',
    aliasTransferencia: 'donspiedo.mp',
    cvuTransferencia: '0000000000000000000000',
    costoDelivery: 1000,
    coordenadasLocal: { lat: -31.342917, lng: -64.275861 }
};

function formatearMonedaCheckout(valor) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(valor);
}

// Formatear número con comas para input
function formatearNumeroConComas(valor) {
    if (!valor) return '';
    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Parsear número con comas
function parsearNumeroConComas(valor) {
    if (!valor) return 0;
    return Number(valor.replace(/,/g, ''));
}

// Obtener tipo de pedido seleccionado
function obtenerTipoPedido() {
    const tipoPedido = document.querySelector('input[name="tipoPedido"]:checked')?.value;
    return tipoPedido || 'delivery';
}

// Mostrar resumen del pedido
function mostrarResumenCheckout() {
    const carrito = JSON.parse(localStorage.getItem('carritoPedido') || '[]');
    const tipoPedido = obtenerTipoPedido();
    const itemsResumen = document.getElementById('itemsResumen');
    const totalResumen = document.getElementById('totalResumen');
    
    if (carrito.length === 0) {
        itemsResumen.innerHTML = '<p>No hay items en el carrito</p>';
        totalResumen.textContent = formatearMonedaCheckout(0);
        return;
    }
    
    itemsResumen.innerHTML = '';
    const total = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Calcular costo de delivery según tipo de pedido
    // El delivery tiene un costo fijo
    let costoDelivery = 0;
    if (tipoPedido === 'delivery') {
        costoDelivery = CONFIGURACION_COMERCIO.costoDelivery;
    }
    
    const totalConDelivery = total + costoDelivery;
    
    carrito.forEach(item => {
        // Si es la promoción de 3 pizzas, mostrar las pizzas individualmente
        if (item.esPromocion3Pizzas && item.pizzas) {
            const divPromo = document.createElement('div');
            divPromo.className = 'itemResumen promocion3pizzas';
            divPromo.innerHTML = `<span><strong>${item.name}</strong></span><span>${formatearMonedaCheckout(item.price)}</span>`;
            itemsResumen.appendChild(divPromo);
            
            // Mostrar cada pizza con indicador GRATIS
            item.pizzas.forEach((pizza, index) => {
                const divPizza = document.createElement('div');
                divPizza.className = 'itemResumen detallePizza';
                const esGratis = index > 0;
                divPizza.innerHTML = `<span>${pizza.name} ${esGratis ? '<span class="etiquetaGratis">GRATIS</span>' : ''}</span><span class="${esGratis ? 'precioTachado' : ''}">${formatearMonedaCheckout(pizza.price)}</span>`;
                itemsResumen.appendChild(divPizza);
            });
        } else {
            const div = document.createElement('div');
            div.className = 'itemResumen';
            
            // Mostrar ingredientes personalizados si existen
            let ingredientesHtml = '';
            if (item.ingredientes) {
                if (item.ingredientes.agregar && item.ingredientes.agregar.length > 0) {
                    ingredientesHtml += `<div class="ingredientesResumen">+ ${item.ingredientes.agregar.join(', ')}</div>`;
                }
                if (item.ingredientes.sacar && item.ingredientes.sacar.length > 0) {
                    ingredientesHtml += `<div class="ingredientesResumen">Sin ${item.ingredientes.sacar.join(', ')}</div>`;
                }
            }
            
            div.innerHTML = `
                <div>
                    <span>${item.name} x${item.quantity}</span>
                    ${ingredientesHtml}
                </div>
                <span>${formatearMonedaCheckout(item.price * item.quantity)}</span>
            `;
            itemsResumen.appendChild(div);
        }
    });
    
    // Mostrar costo de delivery si es delivery
    if (tipoPedido === 'delivery') {
        const divDelivery = document.createElement('div');
        divDelivery.className = 'itemResumen';
        divDelivery.innerHTML = `<span>Delivery</span><span>${formatearMonedaCheckout(CONFIGURACION_COMERCIO.costoDelivery)}</span>`;
        itemsResumen.appendChild(divDelivery);
    }
    
    // Mostrar etiqueta según tipo de pedido
    let etiquetaTotal = '';
    if (tipoPedido === 'delivery') {
        etiquetaTotal = ' (Delivery)';
    } else {
        etiquetaTotal = ' (Retiro en el local)';
    }
    
    totalResumen.textContent = formatearMonedaCheckout(totalConDelivery) + etiquetaTotal;
}

// Manejar método de pago
function inicializarPago() {
    const pagaConInput = document.getElementById('pagaCon');
    
    // Formatear input con comas mientras se escribe
    if (pagaConInput) {
        pagaConInput.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/[^0-9]/g, '');
            if (valor) {
                e.target.value = formatearNumeroConComas(valor);
            }
        });
    }
    
    document.querySelectorAll('input[name="metodoPago"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const campoPagaCon = document.getElementById('campoPagaCon');
            const infoTransferencia = document.getElementById('infoTransferencia');
            
            if (radio.value === 'efectivo') {
                campoPagaCon.style.display = 'block';
                document.getElementById('pagaCon').required = true;
            } else {
                campoPagaCon.style.display = 'none';
                document.getElementById('pagaCon').required = false;
            }
            
            // Mostrar información de transferencia
            if (radio.value === 'transferencia') {
                infoTransferencia.style.display = 'block';
            } else {
                infoTransferencia.style.display = 'none';
            }
        });
    });
}

// Manejar tipo de pedido (delivery/retiro)
function inicializarTipoPedido() {
    const seccionDireccion = document.getElementById('seccionDireccion');
    const infoLocal = document.getElementById('infoLocal');
    const calleInput = document.getElementById('calle');
    const numeroInput = document.getElementById('numero');
    
    document.querySelectorAll('input[name="tipoPedido"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const tipoPedido = radio.value;
            
            if (tipoPedido === 'delivery') {
                seccionDireccion.style.display = 'block';
                infoLocal.style.display = 'none';
                // Hacer requeridos los campos de dirección
                calleInput.required = true;
                numeroInput.required = true;
            } else {
                seccionDireccion.style.display = 'none';
                infoLocal.style.display = 'block';
                // Quitar requerido de los campos de dirección
                calleInput.required = false;
                numeroInput.required = false;
            }
            
            // Actualizar resumen
            mostrarResumenCheckout();
        });
    });
}

// Enviar a WhatsApp
function enviarPedidoWhatsApp() {
    const carrito = JSON.parse(localStorage.getItem('carritoPedido') || '[]');
    
    // Validar que el carrito no esté vacío
    if (carrito.length === 0) {
        alert('No hay items en el carrito. Por favor, agrega alimentos antes de confirmar el pedido.');
        return;
    }
    
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const calle = document.getElementById('calle').value;
    const descripcion = document.getElementById('descripcion').value;
    const numero = document.getElementById('numero').value;
    const tipoPedido = obtenerTipoPedido();
    const metodoPago = document.querySelector('input[name="metodoPago"]:checked')?.value;
    const pagaConInput = document.getElementById('pagaCon');
    const pagaCon = pagaConInput ? parsearNumeroConComas(pagaConInput.value) : 0;
    
    // Calcular total con delivery
    const total = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const costoDelivery = tipoPedido === 'delivery' ? CONFIGURACION_COMERCIO.costoDelivery : 0;
    const totalConDelivery = total + costoDelivery;
    
    // Validar método de pago seleccionado
    if (!metodoPago) {
        alert('Por favor, selecciona un método de pago.');
        return;
    }
    
    // Validar monto en efectivo
    if (metodoPago === 'efectivo') {
        if (!pagaCon || pagaCon <= 0) {
            alert('Por favor, ingresa el monto con el que vas a pagar.');
            pagaConInput.focus();
            return;
        }
        if (pagaCon < totalConDelivery) {
            alert('El monto ingresado es menor al total a pagar. Por favor, verifica el monto.');
            pagaConInput.focus();
            return;
        }
    }
    
    let mensaje = `*NUEVO PEDIDO - Don Spiedo*\n\n`;
    mensaje += `*Cliente:* ${nombre} ${apellido}\n`;
    mensaje += `*Teléfono:* ${telefono}\n`;
    
    // Dirección según tipo de pedido
    if (tipoPedido === 'delivery') {
        mensaje += `*Dirección de entrega:* ${calle} ${numero}\n`;
        if (descripcion) {
            mensaje += `*Descripción:* ${descripcion}\n`;
        }
    } else {
        mensaje += `*Retira en el local:* ${CONFIGURACION_COMERCIO.direccionLocal}\n`;
    }
    
    mensaje += `\n*Pedidos:*\n`;
    
    carrito.forEach(item => {
        let linea = `- ${item.name} x${item.quantity}`;
        if (item.ingredientes) {
            if (item.ingredientes.agregar && item.ingredientes.agregar.length > 0) {
                linea += ` (+${item.ingredientes.agregar.join(', ')})`;
            }
            if (item.ingredientes.sacar && item.ingredientes.sacar.length > 0) {
                linea += ` (Sin ${item.ingredientes.sacar.join(', ')})`;
            }
        }
        linea += ` = ${formatearMonedaCheckout(item.price * item.quantity)}`;
        mensaje += linea + '\n';
    });
    
    if (tipoPedido === 'delivery') {
        mensaje += `- Delivery = ${formatearMonedaCheckout(CONFIGURACION_COMERCIO.costoDelivery)}\n`;
    }
    
    mensaje += `\n*Total:* ${formatearMonedaCheckout(totalConDelivery)}`;
    
    if (tipoPedido === 'delivery') {
        mensaje += ` (Delivery)`;
    } else {
        mensaje += ` (Retiro en el local)`;
    }
    
    mensaje += `\n*Método de pago:* ${metodoPago === 'transferencia' ? 'Transferencia' : 'Efectivo'}`;
    
    // Agregar datos de transferencia si corresponde
    if (metodoPago === 'transferencia') {
        mensaje += `\n*Alias:* ${CONFIGURACION_COMERCIO.aliasTransferencia}`;
        mensaje += `\n*CVU:* ${CONFIGURACION_COMERCIO.cvuTransferencia}`;
    }
    
    if (metodoPago === 'efectivo' && pagaCon) {
        const vuelto = pagaCon - totalConDelivery;
        mensaje += `\n*Paga con:* ${formatearMonedaCheckout(pagaCon)}`;
        mensaje += `\n*Vuelto:* ${formatearMonedaCheckout(vuelto)}`;
    }
    
    // Número de WhatsApp del local (debe reemplazarse con el número real)
    const numeroWhatsApp = '543515290303'; // Reemplazar con el número real
    
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    
    // Limpiar carrito
    localStorage.removeItem('carritoPedido');
}

// Inicializar checkout
function inicializarCheckout() {
    if (!document.getElementById('formularioCheckout')) return;
    
    // Manejar tipo de pedido
    inicializarTipoPedido();
    
    // Establecer estado inicial de required en campos de dirección según el radio seleccionado por defecto
    const calleInput = document.getElementById('calle');
    const numeroInput = document.getElementById('numero');
    const tipoPedidoSeleccionado = document.querySelector('input[name="tipoPedido"]:checked')?.value;
    
    if (tipoPedidoSeleccionado === 'delivery') {
        calleInput.required = true;
        numeroInput.required = true;
    } else {
        calleInput.required = false;
        numeroInput.required = false;
    }
    
    // Manejar método de pago
    inicializarPago();
    
    // Enviar a WhatsApp
    document.getElementById('formularioCheckout').addEventListener('submit', (e) => {
        e.preventDefault();
        enviarPedidoWhatsApp();
    });
    
    // Volver al menú principal
    document.getElementById('botonVolver').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // Mostrar resumen
    mostrarResumenCheckout();
}

// Exportar para uso en otros módulos
window.checkoutModule = {
    mostrarResumenCheckout,
    inicializarPago,
    inicializarTipoPedido,
    enviarPedidoWhatsApp,
    inicializarCheckout,
    CONFIGURACION_COMERCIO
};