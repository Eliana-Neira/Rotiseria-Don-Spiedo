// menu.js - Funciones del menú

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
        {name:'Media docena de Empanadas de carne', price: 10550, description: 'Rellenas de carne tradicional.'},
        {name:'Media docena de Empanadas de pollo', price: 10550, description: 'Con sabor suave y casero.'},
        {name:'Media docena de Empanadas mixtas', price: 12250, description: 'Carne y pollo en una docena.'},
        {name:'Media docena de Empanadas de jamón y queso', price: 10550, description: 'Clásicas y deliciosas.'},
        {name:'Media docena de Empanadas Arabes', price: 12250, description: 'Con relleno de carne y especias.'}
    ],
    'Hamburguesas': [
        { name: 'Hamburguesa clásica', price: 15000, description: 'Con queso, tomate y lechuga.', image: 'assets/img/hambclassic.jpg' },
        { name: 'Hamburguesa doble', price: 19500, description: 'Doble carne y doble queso.', image: 'assets/img/hambdoble.jpg' },
        { name: 'Hamburguesa con bacon', price: 18500, description: 'Acompañada de bacon crocante.', image: 'assets/img/hambbacon.jpg' },
        {name: 'Hamburguesa vegetariana', price: 17000, description: 'Con hamburguesa de vegetales y salsa especial.', image: 'assets/img/hambvegan.jpg'},
        {name: 'Hamburguesa BBQ', price: 20000, description: 'Con salsa barbacoa y aros de cebolla.', image: 'assets/img/hambbbq.jpg'},
        {name: 'Hamburguesa Infantin', price: 15000, description: 'Con papas fritas, bebida pequeña y un juguete de regalo', image: 'assets/img/hambinfa.jpg'}
    ],
    'Pizzas': [
        { name: 'Pizza muzzarella', price: 20000, description: 'Clásica y reconfortante.', image: 'assets/img/pizzamuzz.jpg' },
        { name: 'Pizza napolitana', price: 22500, description: 'Con tomate, ajo y oregano.', image: 'assets/img/pizzanapo.jpg' },
        { name: 'Pizza especial', price: 24500, description: 'Con jamón, morrón y queso.', image: 'assets/img/pizzaespecial.jpg' },
        {name: 'Pizza fugazzeta', price: 23000, description: 'Con cebolla y mucho queso.', image: 'assets/img/pizzafuga.jpg'},
        {name: 'Pizza calabresa', price: 25000, description: 'Con rodajas de calabresa y queso.', image: 'assets/img/pizzacala.jpg'},
        {name: 'Pizza cuatro quesos', price: 27000, description: 'Con mezcla de quesos fundidos.', image: 'assets/img/pizzacuatroq.jpg'},
        {name: 'Pizza hawaiana', price: 26000, description: 'Con jamón, piña y queso.', image: 'assets/img/pizzahawaii.jpg'},
        {name:'Media pizza muzzarella', price: 10000, description: 'Clásica y reconfortante.'},
        {name:'Media pizza napolitana', price: 11250, description: 'Con tomate, ajo y oregano.'},
        {name:'Media pizza especial', price: 12250, description: 'Con jamón, morrón y queso.'},
    ],
    'Lomitos': [
        { name: 'Lomito simple', price: 24000, description: 'Con tomate, lechuga y jamón.', image: 'assets/img/lomisimple.jpg' },
        { name: 'Lomito completo', price: 28000, description: 'Con huevo, cheddar y papas.', image: 'assets/img/lomitocomple.jpg' },
        { name: 'Lomito doble', price: 32000, description: 'Doble carne y extra de queso.', image: 'assets/img/lomidoble.jpg' }
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

function abrirDetalleMenu(nombreMenu) {
    if (!detalleMenu || !tituloDetalle || !opcionesDetalle) return;

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

        opcionesDetalle.appendChild(lista);
    }

    detalleMenu.classList.add('show');
    detalleMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
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
    detalleMenu,
    tituloDetalle,
    opcionesDetalle,
    botonCerrarDetalle,
    abrirDetalleMenu,
    cerrarDetalleMenu
};
