// main.js - Archivo principal que orquesta todos los módulos

// Variables globales para la promoción de 3 pizzas
let promocion3PizzasActiva = false;
let pizzasSeleccionadas = [];

// Esperar a que los módulos estén cargados
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrito si estamos en la página principal
    if (document.getElementById('itemsCarrito')) {
        // Referencias a elementos del carrito
        const contenedorItemsCarrito = document.getElementById('itemsCarrito');
        const carritoFlotante = document.getElementById('carritoFlotante');
        const botonCerrarCarrito = document.getElementById('botonCerrarCarrito');
        const botonIconoCarrito = document.querySelector('.botonCarrito');
        
        // Eventos del carrito
        if (botonIconoCarrito) {
            botonIconoCarrito.addEventListener('click', () => carritoModule.alternarCarrito(true));
        }
        
        if (botonCerrarCarrito) {
            botonCerrarCarrito.addEventListener('click', () => carritoModule.alternarCarrito(false));
        }
        
        // Eventos de las promociones
        document.querySelectorAll('.tarjetaPromocion').forEach(tarjeta => {
            tarjeta.addEventListener('click', () => {
                const nombrePromocion = tarjeta.dataset.promocion;
                const promocion = menuModule.promociones[nombrePromocion];
                
                // Verificar si es una promoción múltiple (3 pizzas)
                if (promocion && promocion.tipo === 'promocionMultiple') {
                    iniciarPromocion3Pizzas(nombrePromocion, promocion);
                } else if (nombrePromocion && promocion) {
                    menuModule.abrirDetalleMenu(nombrePromocion);
                }
            });
        });
        
        // Eventos de las tarjetas del menú
        document.querySelectorAll('.tarjeta').forEach(tarjeta => {
            tarjeta.addEventListener('click', (event) => {
                if (event.target.closest('.botonOpcion')) return;
                
                const titulo = tarjeta.querySelector('h3');
                if (titulo) {
                    menuModule.abrirDetalleMenu(titulo.textContent.trim());
                }
            });
        });
        
        // Evento del botón cerrar detalle menú
        if (menuModule.botonCerrarDetalle) {
            menuModule.botonCerrarDetalle.addEventListener('click', () => {
                // Si se cierra en medio de la promoción, cancelar
                if (promocion3PizzasActiva) {
                    cancelarPromocion3Pizzas();
                }
                menuModule.cerrarDetalleMenu();
            });
        }
        
        // Evento del detalle menú para cerrar al hacer click fuera
        if (menuModule.detalleMenu) {
            menuModule.detalleMenu.addEventListener('click', (event) => {
                if (event.target === menuModule.detalleMenu) {
                    if (promocion3PizzasActiva) {
                        cancelarPromocion3Pizzas();
                    }
                    menuModule.cerrarDetalleMenu();
                }
            });
        }
        
        // Eventos de las opciones del menú
        menuModule.opcionesDetalle?.addEventListener('click', (event) => {
            const botonOpcion = event.target.closest('.botonOpcion');
            if (botonOpcion) {
                if (promocion3PizzasActiva) {
                    // Agregar pizza a la promoción
                    agregarPizzaPromocion(botonOpcion.dataset.name, Number(botonOpcion.dataset.price));
                } else {
                    carritoModule.agregarAlCarrito(botonOpcion.dataset.name, Number(botonOpcion.dataset.price));
                    menuModule.cerrarDetalleMenu();
                }
            }
        });
        
        // Eventos del carrito (eliminar, delivery, confirmar)
        contenedorItemsCarrito.addEventListener('click', (event) => {
            const botonEliminar = event.target.closest('.botonEliminar');
            if (botonEliminar) {
                const nombre = botonEliminar.dataset.name;
                const indice = carritoModule.carrito.findIndex(item => item.name === nombre);
                if (indice !== -1) {
                    carritoModule.carrito.splice(indice, 1);
                    carritoModule.renderizarCarrito();
                }
            }
            
            const botonDelivery = event.target.closest('#delivery-gratis-btn');
            if (botonDelivery) {
                carritoModule.deliveryGratisActivo = !carritoModule.deliveryGratisActivo;
                if (carritoModule.deliveryGratisActivo) {
                    botonDelivery.textContent = 'Quitar';
                    botonDelivery.classList.add('activo');
                } else {
                    botonDelivery.textContent = 'Agregar';
                    botonDelivery.classList.remove('activo');
                }
            }
            
            const botonConfirmar = event.target.closest('#confirm-order');
            if (botonConfirmar) {
                // Guardar carrito y delivery gratis en localStorage
                localStorage.setItem('carritoPedido', JSON.stringify(carritoModule.carrito));
                localStorage.setItem('deliveryGratis', carritoModule.deliveryGratisActivo);
                // Redirigir a la página de checkout
                window.location.href = 'checkout.html';
            }
        });
        
        // Renderizar carrito inicial
        carritoModule.renderizarCarrito();
    }
    
    // Inicializar checkout si estamos en la página de checkout
    if (document.getElementById('formularioCheckout')) {
        checkoutModule.inicializarCheckout();
    }
});

// Función para iniciar la promoción de 3 pizzas
function iniciarPromocion3Pizzas(nombrePromocion, promocion) {
    promocion3PizzasActiva = true;
    pizzasSeleccionadas = [];
    
    // Abrir el menú de Pizzas
    abrirMenuPizzasPromocion(promocion);
}

// Función para abrir el menú de pizzas con indicador de promoción
function abrirMenuPizzasPromocion(promocion) {
    if (!menuModule.detalleMenu || !menuModule.tituloDetalle || !menuModule.opcionesDetalle) return;
    
    menuModule.tituloDetalle.textContent = `Selecciona 3 pizzas (${promocion.descripcion})`;
    
    const opciones = menuModule.opcionesMenu['Pizzas'] || [];
    
    menuModule.opcionesDetalle.innerHTML = '';
    const lista = document.createElement('div');
    lista.className = 'opcionesDetalleMenu';
    
    // Agregar contador de pizzas seleccionadas
    const contador = document.createElement('div');
    contador.className = 'contadorPromocion';
    contador.innerHTML = `<p style="color: var(--primario); margin-bottom: 10px;"><strong>Pizzas seleccionadas: <span id="contadorPizzas">0</span>/3</strong></p>`;
    lista.appendChild(contador);
    
opciones.forEach(opcion => {
        const elemento = document.createElement('div');
        elemento.className = 'opcionMenu';
        const imagenHtml = opcion.image ? `<img src="${opcion.image}" alt="${opcion.name}" class="imagenOpcionMenu">` : '';
        elemento.innerHTML = `
            ${imagenHtml}
            <div class="contenidoOpcionMenu">
                <h4>${opcion.name}</h4>
                <p>${opcion.description}</p>
            </div>
            <div class="accionesOpcionMenu">
                <strong>${window.carritoModule ? carritoModule.formatearMoneda(opcion.price) : opcion.price}</strong>
                <button type="button" class="botonOpcion" data-name="${opcion.name}" data-price="${opcion.price}">Elegir</button>
            </div>
        `;
        lista.appendChild(elemento);
    });
    
    menuModule.opcionesDetalle.appendChild(lista);
    
    menuModule.detalleMenu.classList.add('show');
    menuModule.detalleMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

// Función para agregar pizza a la promoción
function agregarPizzaPromocion(nombre, precio) {
    // Verificar que no se haya seleccionado ya esta pizza
    if (pizzasSeleccionadas.find(p => p.name === nombre)) return;
    
    if (pizzasSeleccionadas.length >= 3) return;
    
    pizzasSeleccionadas.push({ name: nombre, price: precio });
    
    // Actualizar contador
    const contadorElement = document.getElementById('contadorPizzas');
    if (contadorElement) {
        contadorElement.textContent = pizzasSeleccionadas.length;
    }
    
    // Si ya se seleccionaron las 3 pizzas, agregar al carrito
    if (pizzasSeleccionadas.length === 3) {
        // Ordenar pizzas por precio (de menor a mayor)
        pizzasSeleccionadas.sort((a, b) => a.price - b.price);
        
        // El precio final es el de la pizza más barata
        const precioFinal = pizzasSeleccionadas[0].price;
        const nombresPizzas = pizzasSeleccionadas.map(p => p.name).join(', ');
        
        carritoModule.carrito.push({
            name: `3 Pizzas (${nombresPizzas})`,
            price: precioFinal,
            quantity: 1,
            esPromocion3Pizzas: true,
            pizzas: pizzasSeleccionadas
        });
        
        carritoModule.renderizarCarrito();
        carritoModule.alternarCarrito(true);
        
        // Resetear estado
        promocion3PizzasActiva = false;
        pizzasSeleccionadas = [];
        
        menuModule.cerrarDetalleMenu();
    }
}

// Función para cancelar la promoción
function cancelarPromocion3Pizzas() {
    promocion3PizzasActiva = false;
    pizzasSeleccionadas = [];
}
