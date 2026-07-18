// menu.js - Funciones del menú

// Ingredientes personalizables por categoría
// Cada ingrediente tiene: id, name, price (costo adicional), type (agregar o sacar)
const ingredientesPersonalizables = {
    'Hamburguesas': {
        agregar: [
            { id: 'cebolla', name: 'Cebolla', price: 500 },
            { id: 'pepinillos', name: 'Pepinillos', price: 500 },
            { id: 'mayonesa', name: 'Mayonesa', price: 500 },
            { id: 'mostaza', name: 'Mostaza', price: 500 }
        ],
        sacar: [
            { id: 'cebolla', name: 'Sin cebolla', price: 0 },
            { id: 'lechuga', name: 'Sin lechuga', price: 0 },
            { id: 'tomate', name: 'Sin tomate', price: 0 },
            { id: 'queso', name: 'Sin queso', price: 0 }
        ]
    },
    'Pizzas': {
        agregar: [
            { id: 'extraQueso', name: 'Extra queso', price: 500 },
            { id: 'oregano', name: 'Orégano', price: 0 },
            { id: 'ajo', name: 'Ajo', price: 0 }
        ],
        sacar: [
            { id: 'queso', name: 'Sin queso', price: 0 },
            { id: 'tomate', name: 'Sin tomate', price: 0 }
        ]
    },
    'Lomitos': {
        agregar: [
            { id: 'cebolla', name: 'Cebolla', price: 500 },
            { id: 'pepinillos', name: 'Pepinillos', price: 500 },
            { id: 'huevo', name: 'Huevo', price: 300 },
            { id: 'papasFritas', name: 'Papas fritas', price: 500 }
        ],
        sacar: [
            { id: 'lechuga', name: 'Sin lechuga', price: 0 },
            { id: 'tomate', name: 'Sin tomate', price: 0 }
        ]
    }
};

const opcionesMenu = {
    'Pollos': [
        { name: 'Pollo al horno clásico con papas', price: 30500, description: 'Con papas y ensalada.', image: 'assets/img/plloclasico.jpg' },
        { name: 'Pollo frito con papas', price: 40000, description: 'Con guarnición especial y salsa.', image: 'assets/img/pollofrito.jpg' },
        { name: 'Pollo al jugo con papas', price: 33500, description: 'Más contundente y crocante.', image: 'assets/img/pollojugo.jpg' }
    ],
    'Empanadas': [
        { name: 'Docena de Empanadas de carne', price: 21100, description: 'Rellenas de carne tradicional.', image: 'assets/img/emcarne.jpg' },
        { name: 'Docena de Empanadas de pollo', price: 21100, description: 'Con sabor suave y casero.', image: 'assets/img/empollo.jpg' },
        { name: 'Docena de Empanadas mixtas', price: 24500, description: 'Carne y pollo en una docena.', image: 'assets/img/emmix.jpg' },
        { name: 'Docena de Empanadas de jamón y queso', price: 21100, description: 'Clásicas y deliciosas.', image: 'assets/img/empjamonq.jpg' },
        { name: 'Docena de Empanadas Arabes', price: 24500, description: 'Con relleno de carne y especias.', image: 'assets/img/emparab.jpg' },
        { name: 'Media docena de Empanadas de carne', price: 12550, description: 'Rellenas de carne tradicional.', image: 'assets/img/emcarne.jpg' },
        { name: 'Media docena de Empanadas de pollo', price: 12550, description: 'Con sabor suave y casero.', image: 'assets/img/empollo.jpg' },
        { name: 'Media docena de Empanadas mixtas', price: 15250, description: 'Carne y pollo en una docena.', image: 'assets/img/emmix.jpg' },
        { name: 'Media docena de Empanadas de jamón y queso', price: 12550, description: 'Clásicas y deliciosas.', image: 'assets/img/empjamonq.jpg' },
        { name: 'Media docena de Empanadas Arabes', price: 14250, description: 'Con relleno de carne y especias.', image: 'assets/img/emparab.jpg' }
    ],
    'Hamburguesas': [
        { name: 'Hamburguesa clásica', price: 15000, description: 'Con queso, tomate y lechuga.', image: 'assets/img/hambclassic.jpg' },
        { name: 'Hamburguesa doble', price: 19500, description: 'Doble carne y doble queso.', image: 'assets/img/hambdoble.jpg' },
        { name: 'Hamburguesa con bacon', price: 18500, description: 'Acompañada de bacon crocante.', image: 'assets/img/hambbacon.jpg' },
        { name: 'Hamburguesa vegetariana', price: 17000, description: 'Con hamburguesa de vegetales y salsa especial.', image: 'assets/img/hambvegan.jpg' },
        { name: 'Hamburguesa BBQ', price: 20000, description: 'Con salsa barbacoa y aros de cebolla.', image: 'assets/img/hambbbq.jpg' },
        { name: 'Hamburguesa Infantin', price: 15000, description: 'Con papas fritas, bebida pequeña y un juguete de regalo', image: 'assets/img/hambinfa.jpg' }
    ],
    'Pizzas': [
        { name: 'Pizza muzzarella', price: 20000, description: 'Clásica y reconfortante.', image: 'assets/img/pizzamuzz.jpg' },
        { name: 'Pizza napolitana', price: 22500, description: 'Con tomate, ajo y oregano.', image: 'assets/img/pizzanapo.jpg' },
        { name: 'Pizza especial', price: 24500, description: 'Con jamón, morrón y queso.', image: 'assets/img/pizzaespecial.jpg' },
        { name: 'Pizza fugazzeta', price: 23000, description: 'Con cebolla y mucho queso.', image: 'assets/img/pizzafuga.jpg' },
        { name: 'Pizza calabresa', price: 25000, description: 'Con rodajas de calabresa y queso.', image: 'assets/img/pizzacala.jpg' },
        { name: 'Pizza cuatro quesos', price: 27000, description: 'Con mezcla de quesos fundidos.', image: 'assets/img/pizzacuatroq.jpg' },
        { name: 'Pizza hawaiana', price: 26000, description: 'Con jamón, piña y queso.', image: 'assets/img/pizzahawaii.jpg' },
        { name: 'Media pizza muzzarella', price: 12000, description: 'Clásica y reconfortante.', image: 'assets/img/pizzamuzz.jpg' },
        { name: 'Media pizza napolitana', price: 13000, description: 'Con tomate, ajo y oregano.', image: 'assets/img/pizzanapo.jpg' },
        { name: 'Media pizza especial', price: 14000, description: 'Con jamón, morrón y queso.', image: 'assets/img/pizzaespecial.jpg' }
    ],
    'Lomitos': [
        { name: 'Lomito simple', price: 24000, description: 'Con tomate, lechuga y jamón.', image: 'assets/img/lomisimple.jpg' },
        { name: 'Lomito completo', price: 28000, description: 'Con huevo, cheddar y papas.', image: 'assets/img/lomitocomple.jpg' },
        { name: 'Lomito doble', price: 32000, description: 'Doble carne y extra de queso.', image: 'assets/img/lomidoble.jpg' }
    ],
    'Bebidas': [
        { name: 'Coca-Cola 1L', price: 4000, description: 'La mas elegida desde siempre', image: 'assets/img/cocacola500.jpg' },
        { name: 'Coca-Cola 500ml', price: 2500, description: 'La mas elegida desde siempre' },
        { name: 'Fanta 1L', price: 4000, description: 'Nunca falla', image: 'assets/img/fanta1l.jpg' },
        { name: 'Fanta 500ml', price: 2500, description: 'Nunca falla' },
        { name: 'Agua Mineral 1L', price: 3000, description: 'Para los mas sanos', image: 'assets/img/aguamineral1l.jpg' },
        { name: 'Agua Mineral 500ml', price: 2000, description: 'Para los mas sanos' }
    ]
};

// Hacer las promociones interactivas
const promociones = {
    '2x1 en empanadas': [
        { name: 'Docena de Empanadas de carne', price: 21100, description: 'Rellenas de carne tradicional.' },
        { name: 'Docena de Empanadas de pollo', price: 21100, description: 'Con sabor suave y casero.' },
        { name: 'Docena de Empanadas mixtas', price: 24500, description: 'Carne y pollo en una docena.' }
    ],
    'Combo familiar': [
        { name: 'Combo familiar - Pollo + papas + gaseosa', price: 35000, description: 'Promoción combo familiar.' }
    ],
    '3 pizzas por un precio especial.': {
        tipo: 'promocionMultiple', menu: 'Pizzas', cantidad: 3, descripcion: 'Solo válida los días lunes'
    }
};

const detalleMenu = document.getElementById('detalleMenu');
const tituloDetalle = document.getElementById('tituloDetalle');
const opcionesDetalle = document.getElementById('opcionesDetalleMenu');
const botonCerrarDetalle = document.getElementById('botonCerrarDetalle');

// Variables para personalización
let menuActual = '';
let ingredientesSeleccionados = {};

function abrirDetalleMenu(nombreMenu) {
    if (!detalleMenu || !tituloDetalle || !opcionesDetalle) return;

    menuActual = nombreMenu;
    ingredientesSeleccionados = {};
    
    tituloDetalle.textContent = nombreMenu;
    // Buscar en opcionesMenu o en promociones
    const opciones = opcionesMenu[nombreMenu] || promociones[nombreMenu] || [];

    if (opciones.length === 0) {
        opcionesDetalle.innerHTML = '<p class="menu-detail-empty">Próximamente más opciones para este menú.</p>';
    } else {
        opcionesDetalle.innerHTML = '';
        const lista = document.createElement('div');
        lista.className = 'opcionesDetalleMenu';

        opciones.forEach(opcion => {
            const elemento = document.createElement('div');
            elemento.className = 'opcionMenu';
            const imagenHtml = opcion.image ? `<img src="${opcion.image}" alt="${opcion.name}" class="imagenOpcionMenu">` : '';
            
            // Agregar selector de ingredientes si la categoría lo tiene
            const ingredientesHtml = obtenerIngredientesHtml(nombreMenu, opcion.name);
            
            elemento.innerHTML = `
                ${imagenHtml}
                <div class="contenidoOpcionMenu">
                    <h4>${opcion.name}</h4>
                    <p>${opcion.description}</p>
                </div>
                ${ingredientesHtml}
                <div class="accionesOpcionMenu">
                    <strong>${window.carritoModule ? carritoModule.formatearMoneda(opcion.price) : opcion.price}</strong>
                    <button type="button" class="botonOpcion" data-name="${opcion.name}" data-price="${opcion.price}">Elegir</button>
                </div>
            `;
            lista.appendChild(elemento);
        });

        opcionesDetalle.appendChild(lista);
    }

    detalleMenu.classList.add('show');
    detalleMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

// Generar HTML para los ingredientes personalizables con chips
function obtenerIngredientesHtml(categoria, nombreItem) {
    const ingredientes = ingredientesPersonalizables[categoria];
    if (!ingredientes) return '';
    
    const key = `${categoria}-${nombreItem}`;
    const seleccionados = ingredientesSeleccionados[key] || { agregar: [], sacar: [] };
    
    // Determinar el tipo de comida para el texto
    const tipoComida = categoria === 'Hamburguesas' ? 'hamburguesa' : categoria === 'Pizzas' ? 'pizza' : 'lomito';
    
    return `
        <div class="ingredientesPersonalizables" data-item="${nombreItem}">
            <div class="headerIngredientes" data-item="${nombreItem}">
                <p class="tituloIngredientes">Personaliza tu ${tipoComida}</p>
                <span class="flechitaIngredientes">▶</span>
            </div>
            <div class="contenidoIngredientes collapsed">
                ${ingredientes.agregar && ingredientes.agregar.length > 0 ? `
                    <div class="seccionIngredientes">
                        <p class="subtituloIngredientes">Agregar</p>
                        <div class="listaIngredientes">
                            ${ingredientes.agregar.map(ing => `
                                <label class="chipIngrediente agregar ${seleccionados.agregar && seleccionados.agregar.includes(ing.id) ? 'seleccionado' : ''}" 
                                       data-item="${nombreItem}" 
                                       data-ing="${ing.id}" 
                                       data-type="agregar"
                                       data-price="${ing.price}">
                                    <input type="checkbox" class="checkboxIngrediente" 
                                           data-item="${nombreItem}" 
                                           data-ing="${ing.id}" 
                                           data-type="agregar"
                                           data-price="${ing.price}"
                                           ${seleccionados.agregar && seleccionados.agregar.includes(ing.id) ? 'checked' : ''}>
                                    <span>${ing.name}</span>
                                    <span class="precioIngrediente">+$${ing.price}</span>
                                    <span class="iconoCheck">✓</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${ingredientes.sacar && ingredientes.sacar.length > 0 ? `
                    <div class="seccionIngredientes">
                        <p class="subtituloIngredientes">Sacar</p>
                        <div class="listaIngredientes">
                            ${ingredientes.sacar.map(ing => `
                                <label class="chipIngrediente sacar ${seleccionados.sacar && seleccionados.sacar.includes(ing.id) ? 'seleccionado' : ''}" 
                                       data-item="${nombreItem}" 
                                       data-ing="${ing.id}" 
                                       data-type="sacar"
                                       data-price="${ing.price}">
                                    <input type="checkbox" class="checkboxIngrediente" 
                                           data-item="${nombreItem}" 
                                           data-ing="${ing.id}" 
                                           data-type="sacar"
                                           data-price="${ing.price}"
                                           ${seleccionados.sacar && seleccionados.sacar.includes(ing.id) ? 'checked' : ''}>
                                    <span>${ing.name}</span>
                                    <span class="iconoCheck">✕</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function cerrarDetalleMenu() {
    if (!detalleMenu) return;

    detalleMenu.classList.remove('show');
    detalleMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Exportar para uso en otros módulos
window.menuModule = {
    opcionesMenu,
    promociones,
    ingredientesPersonalizables,
    detalleMenu,
    tituloDetalle,
    opcionesDetalle,
    botonCerrarDetalle,
    abrirDetalleMenu,
    cerrarDetalleMenu,
    menuActual,
    ingredientesSeleccionados
};