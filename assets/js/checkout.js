// checkout.js - Funciones del checkout

function formatearMonedaCheckout(valor) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(valor);
}

// Mostrar resumen del pedido
function mostrarResumenCheckout() {
    const carrito = JSON.parse(localStorage.getItem('carritoPedido') || '[]');
    const deliveryGratis = localStorage.getItem('deliveryGratis') === 'true';
    const itemsResumen = document.getElementById('itemsResumen');
    const totalResumen = document.getElementById('totalResumen');
    
    if (carrito.length === 0) {
        itemsResumen.innerHTML = '<p>No hay items en el carrito</p>';
        return;
    }
    
    itemsResumen.innerHTML = '';
    const total = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
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
            div.innerHTML = `<span>${item.name} x${item.quantity}</span><span>${formatearMonedaCheckout(item.price * item.quantity)}</span>`;
            itemsResumen.appendChild(div);
        }
    });
    
    totalResumen.textContent = formatearMonedaCheckout(total) + (deliveryGratis ? ' (Delivery gratis)' : '');
}

// Manejar método de pago
function inicializarPago() {
    document.querySelectorAll('input[name="metodoPago"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const campoPagaCon = document.getElementById('campoPagaCon');
            if (radio.value === 'efectivo') {
                campoPagaCon.style.display = 'block';
                document.getElementById('pagaCon').required = true;
            } else {
                campoPagaCon.style.display = 'none';
                document.getElementById('pagaCon').required = false;
            }
        });
    });
}

// Enviar a WhatsApp
function enviarPedidoWhatsApp() {
    const carrito = JSON.parse(localStorage.getItem('carritoPedido') || '[]');
    const deliveryGratis = localStorage.getItem('deliveryGratis') === 'true';
    
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const calle = document.getElementById('calle').value;
    const descripcion = document.getElementById('descripcion').value;
    const numero = document.getElementById('numero').value;
    const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;
    const pagaCon = document.getElementById('pagaCon').value;
    
    
    const total = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    let mensaje = `*NUEVO PEDIDO - Don Spiedo*\n\n`;
    mensaje += `*Cliente:* ${nombre} ${apellido}\n`;
    mensaje += `*Teléfono:* ${telefono}\n`;
    mensaje += `*Dirección:* ${calle} ${numero}\n\n`;
    mensaje += `*Pedidos:*\n`;
    
    carrito.forEach(item => {
        mensaje += `- ${item.name} x${item.quantity} = ${formatearMonedaCheckout(item.price * item.quantity)}\n`;
    });
    
    mensaje += `\n*Total:* ${formatearMonedaCheckout(total)}`;
    
    if (deliveryGratis) {
        mensaje += ` (Delivery gratis)`;
    }
    
    mensaje += `\n*Método de pago:* ${metodoPago === 'transferencia' ? 'Transferencia' : 'Efectivo'}`;
    
    if (metodoPago === 'efectivo' && pagaCon) {
        const vuelto = pagaCon - total;
        mensaje += `\n*Paga con:* ${formatearMonedaCheckout(Number(pagaCon))}`;
        mensaje += `\n*Vuelto:* ${vuelto < 0 ? formatearMonedaCheckout(vuelto) : alert('Debe pagar más')}`;
    }
    
    // Número de WhatsApp del local (debe reemplazarse con el número real)
    const numeroWhatsApp = '543515290303'; // Reemplazar con el número real
    
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    
    // Limpiar carrito
    localStorage.removeItem('carritoPedido');
    localStorage.removeItem('deliveryGratis');
}

// Inicializar checkout
function inicializarCheckout() {
    if (!document.getElementById('formularioCheckout')) return;
    
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
    enviarPedidoWhatsApp,
    inicializarCheckout
};