// carrito.js - Funciones del carrito

let carrito = [];
let deliveryGratisActivo = false;

function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(valor);
}

function calcularTotal() {
    return carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderizarCarrito() {
    const contenedorItemsCarrito = document.getElementById('itemsCarrito');
    const elementoTotalCarrito = document.querySelector('.totalCarrito');
    const elementoContadorCarrito = document.getElementById('contadorCarrito');
    
    if (!contenedorItemsCarrito || !elementoTotalCarrito) return;

    // Contar items: la promoción de 3 pizzas cuenta como 3 items
    const totalItems = carrito.reduce((sum, item) => {
        if (item.esPromocion3Pizzas && item.pizzas) {
            return sum + 3; // 3 pizzas en la promoción
        }
        return sum + item.quantity;
    }, 0);
    const total = calcularTotal();

    if (elementoContadorCarrito) {
        elementoContadorCarrito.textContent = totalItems;
        elementoContadorCarrito.style.display = totalItems > 0 ? 'inline-flex' : 'none';
    }

    if (carrito.length === 0) {
        contenedorItemsCarrito.innerHTML = '<div class="carritoVacio">Tu carrito está vacío.</div>';
        elementoTotalCarrito.textContent = 'Total: $0';
        return;
    }

    contenedorItemsCarrito.innerHTML = '';

    carrito.forEach(item => {
        // Si es la promoción de 3 pizzas, mostrar las pizzas individualmente
        if (item.esPromocion3Pizzas && item.pizzas) {
            // Mostrar el título de la promoción
            const filaPromo = document.createElement('div');
            filaPromo.className = 'itemCarrito promocion3pizzas';
            filaPromo.innerHTML = `
                <span><strong>${item.name}</strong></span>
                <div class="accionesItemCarrito">
                    <strong>${formatearMoneda(item.price)}</strong>
                    <button class="botonEliminar" data-name="${item.name}">Eliminar</button>
                </div>
            `;
            contenedorItemsCarrito.appendChild(filaPromo);
            
// Mostrar cada pizza con precio tachado
            item.pizzas.forEach((pizza, index) => {
                const filaPizza = document.createElement('div');
                filaPizza.className = 'itemCarrito detallePizza';
                const esGratis = index > 0; // Las 2 últimas son gratis
                filaPizza.innerHTML = `
                    <span class="nombrePizza">${pizza.name} ${esGratis ? '<span class="etiquetaGratis">GRATIS</span>' : ''}</span>
                    <div class="accionesItemCarrito">
                        <strong class="${esGratis ? 'precioTachado' : ''}">${formatearMoneda(pizza.price)}</strong>
                    </div>
                `;
                contenedorItemsCarrito.appendChild(filaPizza);
            });
        } else {
            const fila = document.createElement('div');
            fila.className = 'itemCarrito';
            fila.innerHTML = `
                <span>${item.name} x${item.quantity}</span>
                <div class="accionesItemCarrito">
                    <strong>${formatearMoneda(item.price * item.quantity)}</strong>
                    <button class="botonEliminar" data-name="${item.name}">Eliminar</button>
                </div>
            `;
            contenedorItemsCarrito.appendChild(fila);
        }
    });

    // Mostrar opción de delivery gratis si el total supera $8000
    if (total >= 8000) {
        const filaDelivery = document.createElement('div');
        filaDelivery.className = 'itemCarrito deliveryOption';
        const textoDelivery = deliveryGratisActivo ? '✅ Delivery gratis activado' : '🚚 Delivery gratis disponible';
        const textoBoton = deliveryGratisActivo ? 'Quitar' : 'Agregar';
        const claseActivo = deliveryGratisActivo ? 'activo' : '';
        filaDelivery.innerHTML = `
            <span>${textoDelivery}</span>
            <button class="botonDelivery ${claseActivo}" id="delivery-gratis-btn">${textoBoton}</button>
        `;
        contenedorItemsCarrito.appendChild(filaDelivery);
    }

    // Mostrar el total con indicación de delivery gratis si está activo
    if (deliveryGratisActivo) {
        elementoTotalCarrito.innerHTML = `Total: ${formatearMoneda(total)} <span class="etiquetaDelivery">(Delivery gratis)</span>`;
    } else {
        elementoTotalCarrito.textContent = `Total: ${formatearMoneda(total)}`;
    }

    const filaConfirmar = document.createElement('div');
    filaConfirmar.className = 'itemCarrito';
    filaConfirmar.innerHTML = `
        <span>Confirmar pedido</span>
        <button class="botonConfirmar" id="confirm-order">Confirmar</button>
    `;
    contenedorItemsCarrito.appendChild(filaConfirmar);
}

function alternarCarrito(mostrar) {
    const carritoFlotante = document.getElementById('carritoFlotante');
    if (carritoFlotante) {
        carritoFlotante.classList.toggle('show', mostrar);
    }
}

function agregarAlCarrito(nombre, precio) {
    const elementoExistente = carrito.find(item => item.name === nombre);
    if (elementoExistente) {
        elementoExistente.quantity += 1;
    } else {
        carrito.push({ name: nombre, price: precio, quantity: 1 });
    }

    renderizarCarrito();
    alternarCarrito(true);
}

// Exportar para uso en otros módulos
window.carritoModule = {
    carrito,
    deliveryGratisActivo,
    formatearMoneda,
    calcularTotal,
    renderizarCarrito,
    alternarCarrito,
    agregarAlCarrito
};