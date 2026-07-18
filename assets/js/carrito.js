// carrito.js - Funciones del carrito

let carrito = [];

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
            
            // Mostrar ingredientes personalizados si existen
            let ingredientesHtml = '';
            if (item.ingredientes) {
                if (item.ingredientes.agregar && item.ingredientes.agregar.length > 0) {
                    ingredientesHtml += `<div class="ingredientesItemCarrito">+ ${item.ingredientes.agregar.join(', ')}</div>`;
                }
                if (item.ingredientes.sacar && item.ingredientes.sacar.length > 0) {
                    ingredientesHtml += `<div class="ingredientesItemCarrito">Sin ${item.ingredientes.sacar.join(', ')}</div>`;
                }
            }
            
            fila.innerHTML = `
                <div>
                    <span>${item.name} x${item.quantity}</span>
                    ${ingredientesHtml}
                </div>
                <div class="accionesItemCarrito">
                    <strong>${formatearMoneda(item.price * item.quantity)}</strong>
                    <button class="botonEliminar" data-name="${item.name}">Eliminar</button>
                </div>
            `;
            contenedorItemsCarrito.appendChild(fila);
        }
    });

    // Mostrar el total
    elementoTotalCarrito.textContent = `Total: ${formatearMoneda(total)}`;

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

function agregarAlCarrito(nombre, precio, ingredientes = { agregar: [], sacar: [] }) {
    // Calcular precio adicional por ingredientes
    const precioIngredientes = (ingredientes.agregar || []).reduce((sum, ingId) => {
        const ing = Object.values(menuModule.ingredientesPersonalizables || {})
            .flatMap(cat => cat.agregar || [])
            .find(i => i.id === ingId);
        return sum + (ing ? ing.price : 0);
    }, 0);
    
    // Obtener nombres de ingredientes
    const nombresAgregar = (ingredientes.agregar || []).map(ingId => {
        const ing = Object.values(menuModule.ingredientesPersonalizables || {})
            .flatMap(cat => cat.agregar || [])
            .find(i => i.id === ingId);
        return ing ? ing.name : ingId;
    });
    
    const nombresSacar = (ingredientes.sacar || []).map(ingId => {
        const ing = Object.values(menuModule.ingredientesPersonalizables || {})
            .flatMap(cat => cat.sacar || [])
            .find(i => i.id === ingId);
        return ing ? ing.name : ingId;
    });
    
    const elementoExistente = carrito.find(item => item.name === nombre);
    if (elementoExistente) {
        elementoExistente.quantity += 1;
    } else {
        const item = { 
            name: nombre, 
            price: precio + precioIngredientes, 
            quantity: 1,
            ingredientes: {
                agregar: nombresAgregar,
                sacar: nombresSacar
            },
            precioIngredientes: precioIngredientes
        };
        carrito.push(item);
    }

    // Guardar en localStorage
    localStorage.setItem('carritoPedido', JSON.stringify(carrito));

    renderizarCarrito();
    alternarCarrito(true);
}

// Cargar carrito desde localStorage
function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem('carritoPedido');
    if (carritoGuardado) {
        // Vaciar el carrito actual y cargar los items guardados
        carrito.length = 0;
        const items = JSON.parse(carritoGuardado);
        items.forEach(item => carrito.push(item));
    }
}

// Eliminar item del carrito
function eliminarDelCarrito(nombre) {
    const indice = carrito.findIndex(item => item.name === nombre);
    if (indice !== -1) {
        carrito.splice(indice, 1);
        localStorage.setItem('carritoPedido', JSON.stringify(carrito));
        renderizarCarrito();
    }
}

// Exportar para uso en otros módulos
window.carritoModule = {
    carrito,
    formatearMoneda,
    calcularTotal,
    renderizarCarrito,
    alternarCarrito,
    agregarAlCarrito,
    cargarCarritoDesdeStorage,
    eliminarDelCarrito
};
