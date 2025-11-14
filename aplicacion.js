document.addEventListener('DOMContentLoaded', function () {
    
    const ID_GOOGLE = '321766301291-k2ni9fbsm6ddmvte8otola8gro8lg92b.apps.googleusercontent.com';
    const CLAVE_USUARIOS = 'mz_users_v1';
    const CLAVE_CARRITO = 'mz_cart_v1';
    const CLAVE_USUARIO_ACTUAL = 'mz_current_user_v1';
    const headerContainer = document.querySelector('.header-container');
    const menuToggleBtn = document.getElementById('menu-toggle');

    let carrito = [];
    let productoSeleccionado = null;
    const PRODUCTOS = [
        {
            id: 1,
            nombre: 'Urban Classic Black',
            precio: 89.99,
            imagen: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80',
            descripcion: 'Zapatillas urbanas clásicas en color negro, perfectas para el día a día.',
            tallas: [7, 8, 9, 10, 11, 12]
        },
        {
            id: 2,
            nombre: 'Sport White',
            precio: 94.99,
            imagen: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=812&q=80',
            descripcion: 'Zapatillas deportivas en blanco.',
            tallas: [6, 7, 8, 9, 10, 11]
        },
        {
            id: 3,
            nombre: 'Black Pro',
            precio: 99.99,
            imagen: 'https://images.unsplash.com/photo-1605030753481-bb38b08c384a?ixlib=rb-4.0.3&auto=format&fit=crop&w=749&q=80',
            descripcion: 'Edición profesional en negro con refuerzos estratégicos.',
            tallas: [8, 9, 10, 11, 12, 13]
        },
        {
            id: 4,
            nombre: 'Red Street',
            precio: 87.99,
            imagen: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
            descripcion: 'Zapatillas urbanas en rojo vibrante para destacar tu estilo.',
            tallas: [7, 8, 9, 10, 11]
        }
    ];

    const SERVICIOS = [
        { nombre: 'Cambio de suela', descripcion: 'Reemplazo completo de la suela desgastada', precio: 25.00 },
        { nombre: 'Reparación de costuras', descripcion: 'Arreglo de costuras rotas o desgastadas', precio: 15.00 },
        { nombre: 'Reemplazo de cordones', descripcion: 'Cambio de cordones por unos nuevos', precio: 8.00 },
        { nombre: 'Limpieza profunda', descripcion: 'Limpieza completa y restauración de color', precio: 12.00 },
        { nombre: 'Reparación de cremallera', descripcion: 'Arreglo o reemplazo de cremallera dañada', precio: 18.00 },
        { nombre: 'Refuerzo de talón', descripcion: 'Refuerzo interno para mayor durabilidad', precio: 10.00 }
    ];

    inicializarApp();

    function desplazarSuavemente(idSeccion) {
        const destino = document.getElementById(idSeccion);
        if (!destino) return;
        requestAnimationFrame(() => {
            destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    function actualizarEstadoMenuResponsive(abierto) {
        if (!menuToggleBtn) return;
        menuToggleBtn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    }

    function cerrarMenuResponsive() {
        if (!headerContainer) return;
        headerContainer.classList.remove('nav-open');
        actualizarEstadoMenuResponsive(false);
    }

    function inicializarApp() {
        mostrarProductos();
        mostrarServicios();
        vincularEventos();
        cargarCarrito();
        actualizarUsuario();

        // Google Identity carga asíncrona
        if (typeof google !== 'undefined') {
            inicializarGoogle();
        } else {
            let intentos = 0;
            const intervalo = setInterval(function() {
                if (typeof google !== 'undefined') {
                    clearInterval(intervalo);
                    inicializarGoogle();
                } else if (++intentos > 50) {
                    clearInterval(intervalo);
                }
            }, 100);
        }

    }

    function mostrarProductos() {
        const contenedor = document.querySelector('.products-grid');
        if (!contenedor) return;
        
        contenedor.innerHTML = '';
        PRODUCTOS.forEach(producto => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'product-card';
            tarjeta.innerHTML = `
                <div class="product-img"><img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy"></div>
                <div class="product-info">
                    <h3 class="product-title">${producto.nombre}</h3>
                    <p class="product-price">$${producto.precio.toFixed(2)}</p>
                    <a href="#" class="btn ver-producto" data-id="${producto.id}">Ver Detalles</a>
                </div>
            `;
            contenedor.appendChild(tarjeta);
        });
    }

    function mostrarDetalleProducto(id) {
        productoSeleccionado = PRODUCTOS.find(p => p.id === id);
        if (!productoSeleccionado) return;
        
        const contenedor = document.getElementById('product-detail-container');
        contenedor.innerHTML = `
            <div class="product-detail-image"><img src="${productoSeleccionado.imagen}" alt="${productoSeleccionado.nombre}"></div>
            <div class="product-detail-info">
                <h2>${productoSeleccionado.nombre}</h2>
                <p class="product-detail-price">$${productoSeleccionado.precio.toFixed(2)}</p>
                <p class="product-detail-description">${productoSeleccionado.descripcion}</p>
                <div class="size-selector">
                    <h3>Selecciona tu talla:</h3>
                    <div class="size-options">
                        ${productoSeleccionado.tallas.map(t => `<div class="size-option" data-size="${t}">${t}</div>`).join('')}
                    </div>
                </div>
                <div class="quantity-selector">
                    <h3>Cantidad:</h3>
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease">-</button>
                        <input type="number" class="quantity-input" value="1" min="1">
                        <button class="quantity-btn increase">+</button>
                    </div>
                </div>
                <button class="btn agregar-carrito">Añadir al Carrito</button>
            </div>
        `;
        mostrarPestana('product-detail');
    }

    function agregarAlCarrito() {
        const usuario = obtenerUsuario();
        if (!usuario) {
            abrirModalAutenticacion('iniciar-sesion');
            return;
        }

        const talla = document.querySelector('.size-option.selected')?.getAttribute('data-size');
        const cantidad = Math.max(1, parseInt(document.querySelector('.quantity-input')?.value) || 1);

        if (!talla) {
            alert('Por favor, selecciona una talla.');
            return;
        }

        const indice = carrito.findIndex(i => i.id === productoSeleccionado.id && i.talla === talla);
        
        if (indice !== -1) {
            carrito[indice].cantidad += cantidad;
        } else {
            carrito.push({
                id: productoSeleccionado.id,
                nombre: productoSeleccionado.nombre,
                precio: productoSeleccionado.precio,
                talla,
                cantidad,
                imagen: productoSeleccionado.imagen
            });
        }

        guardarCarrito();
        mostrarPestana('carrito');
        alert('Producto añadido al carrito.');
    }

    function mostrarCarrito() {
        const contenedor = document.getElementById('cart-items');
        const resumen = document.getElementById('cart-summary');
        if (!contenedor || !resumen) return;

        // Si el carrito está vacío, reconstruimos el bloque con el mensaje vacío
        if (carrito.length === 0) {
            contenedor.innerHTML = `
                <div class="empty-cart-message" id="empty-cart-message">
                    <p>Tu carrito está vacío. <a href="#" class="nav-link" data-tab="productos">¡Agrega productos!</a></p>
                </div>
            `;
            resumen.style.display = 'none';
            return;
        }

        // Con elementos en el carrito
        resumen.style.display = 'block';
        contenedor.innerHTML = carrito.map((item, idx) => `
            <div class="cart-item">
                <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.nombre}</h4>
                    <p>Talla: ${item.talla}</p>
                    <p>Precio: $${item.precio.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn cart-menos" data-idx="${idx}">-</button>
                    <input type="number" class="quantity-input" value="${item.cantidad}" min="1" data-idx="${idx}">
                    <button class="quantity-btn cart-mas" data-idx="${idx}">+</button>
                </div>
                <div class="cart-item-total">$${(item.precio * item.cantidad).toFixed(2)}</div>
                <button class="remove-item" data-idx="${idx}">Eliminar</button>
            </div>
        `).join('');

        const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const envio = subtotal > 100 ? 0 : 10;
        const total = subtotal + envio;

        document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cart-shipping').textContent = `$${envio.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    }

    function guardarCarrito() {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    }

    function cargarCarrito() {
        try {
            carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
        } catch {
            carrito = [];
        }
    }

    function mostrarServicios() {
        const contenedor = document.getElementById('repair-services');
        if (!contenedor) return;
        
        contenedor.innerHTML = '';
        SERVICIOS.forEach((servicio, idx) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${servicio.nombre}</td>
                <td>${servicio.descripcion}</td>
                <td class="repair-price">$${servicio.precio.toFixed(2)}</td>
                <td><input type="checkbox" class="repair-checkbox" data-idx="${idx}" data-price="${servicio.precio}"></td>
            `;
            contenedor.appendChild(fila);
        });
    }

    function actualizarCotizacion() {
        const seleccionados = document.querySelectorAll('.repair-checkbox:checked');
        let total = 0;
        seleccionados.forEach(cb => {
            total += parseFloat(cb.getAttribute('data-price')) || 0;
        });
        const el = document.getElementById('repair-quote-total');
        if (el) el.textContent = `$${total.toFixed(2)}`;
    }

    function enviarCotizacion() {
        const seleccionados = document.querySelectorAll('.repair-checkbox:checked');
        const nombre = document.getElementById('customer-name')?.value || '';
        const correo = document.getElementById('customer-email')?.value || '';

        if (seleccionados.length === 0) {
            alert('Por favor, selecciona al menos un servicio.');
            return;
        }

        if (!nombre || !correo) {
            alert('Por favor, completa tu nombre y correo.');
            return;
        }

        let total = 0;
        let lista = '';
        seleccionados.forEach(cb => {
            const idx = parseInt(cb.getAttribute('data-idx'));
            const precio = SERVICIOS[idx].precio;
            total += precio;
            lista += `- ${SERVICIOS[idx].nombre}: $${precio.toFixed(2)}\n`;
        });

        alert(`✅ Cotización solicitada!\n\n${lista}\nTotal: $${total.toFixed(2)}\n\n📧 Contactaremos a ${correo}`);

        document.querySelectorAll('.repair-checkbox').forEach(cb => cb.checked = false);
        document.getElementById('customer-name').value = '';
        document.getElementById('customer-email').value = '';
        document.getElementById('customer-phone').value = '';
        actualizarCotizacion();
    }

    function abrirModalAutenticacion(modo = 'iniciar-sesion') {
        const modal = document.getElementById('auth-modal');
        modal.classList.add('active');
        const esLogin = modo === 'iniciar-sesion';
        const esRegistro = modo === 'registro';
        document.getElementById('tab-login').classList.toggle('active', esLogin);
        document.getElementById('tab-register').classList.toggle('active', esRegistro);
        document.getElementById('login-form').classList.toggle('active', esLogin);
        document.getElementById('register-form').classList.toggle('active', esRegistro);
        document.getElementById('recover-password-form').classList.remove('active');
    }

    function cerrarModalAutenticacion() {
        document.getElementById('auth-modal').classList.remove('active');
    }

    function manejarRegistro(e) {
        e.preventDefault();
        const contraseña = (document.getElementById('reg-password').value || '');
        const nombre = (document.getElementById('reg-name').value || '').trim();
        const correo = (document.getElementById('reg-email').value || '').trim();
        const pais = (document.getElementById('reg-country').value || '').trim();
        const curpRfc = (document.getElementById('reg-curp-rfc').value || '').trim();
        const telefono = (document.getElementById('reg-phone').value || '').trim();

        if (!contraseña || !nombre || !correo || !pais) {
            alert('Completa todos los campos obligatorios.');
            return;
        }

        if (contraseña.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(correo)) {
            alert('Correo inválido.');
            return;
        }

        let usuarios = obtenerUsuarios();
        
        if (usuarios.find(u => (u.correo || '').toLowerCase() === correo.toLowerCase())) {
            alert('El correo ya está registrado.');
            return;
        }
        usuarios.push({ contraseña, nombre, correo, pais, curpRfc, telefono });
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
        establecerUsuario({ nombre, correo, pais, telefono });
        cerrarModalAutenticacion();
        actualizarUsuario();
    }

    function manejarInicioDeSesion(e) {
        e.preventDefault();
        const correo = (document.getElementById('auth-email').value || '').trim();
        const contraseña = (document.getElementById('auth-password').value || '');
        
        if (!correo || !contraseña) {
            alert('Completa correo y contraseña.');
            return;
        }

        const usuarios = obtenerUsuarios();
        const encontrado = usuarios.find(u => u.correo === correo && u.contraseña === contraseña);

        if (encontrado) {
            establecerUsuario({ nombre: encontrado.nombre, correo: encontrado.correo, telefono: encontrado.telefono, pais: encontrado.pais });
            cerrarModalAutenticacion();
            actualizarUsuario();
        } else {
            alert('Correo o contraseña incorrectos.');
        }
    }

    function actualizarUsuario() {
        const boton = document.getElementById('boton-usuario');
        const nameEl = document.getElementById('user-info-name');
        const usuario = obtenerUsuario();

        if (usuario) {
            const displayName = (usuario.nombre || '').trim() || usuario.correo || 'Mi cuenta';
            if (boton) {
                boton.innerHTML = '<i class="fas fa-user-circle"></i>';
                boton.style.cursor = 'pointer';
                boton.setAttribute('title', displayName);
            }
            if (nameEl) {
                nameEl.textContent = displayName;
                nameEl.style.display = 'block';
            }
        } else {
            boton.innerHTML = '<i class="fas fa-user"></i>';
            boton.style.cursor = 'pointer';
            if (nameEl) {
                nameEl.textContent = '';
                nameEl.style.display = 'none';
            }
            cerrarMenuUsuario();
        }
    }

    function obtenerUsuarios() {
        try {
            return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
        } catch {
            return [];
        }
    }

    function obtenerUsuario() {
        try {
            const datos = localStorage.getItem(CLAVE_USUARIO_ACTUAL);
            return datos ? JSON.parse(datos) : null;
        } catch {
            return null;
        }
    }

    function establecerUsuario(usuario) {
        localStorage.setItem(CLAVE_USUARIO_ACTUAL, JSON.stringify(usuario));
    }

    function cerrarSesion() {
        localStorage.removeItem(CLAVE_USUARIO_ACTUAL);
        actualizarUsuario();
        cerrarMenuUsuario();
        mostrarPestana('inicio');
    }

    function mostrarMenuUsuario() {
        const menu = document.getElementById('user-menu');
        const boton = document.getElementById('boton-usuario');
        if (menu) {
            menu.classList.add('show');
            menu.setAttribute('aria-hidden', 'false');
        }
        if (boton) boton.setAttribute('aria-expanded', 'true');
    }

    function cerrarMenuUsuario() {
        const menu = document.getElementById('user-menu');
        const boton = document.getElementById('boton-usuario');
        if (menu) {
            menu.classList.remove('show');
            menu.setAttribute('aria-hidden', 'true');
        }
        if (boton) boton.setAttribute('aria-expanded', 'false');
    }

    function inicializarGoogle() {
        if (!ID_GOOGLE || ID_GOOGLE.includes('REPLACE')) return;

        google.accounts.id.initialize({
            client_id: ID_GOOGLE,
            callback: manejarGoogle,
            auto_select: false,
        });

        const contenedorLogin = document.getElementById('google-signin-button');
        const contenedorRegistro = document.getElementById('google-register-button');

        if (contenedorLogin) {
            google.accounts.id.renderButton(contenedorLogin, {
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
            });
        }

        if (contenedorRegistro) {
            google.accounts.id.renderButton(contenedorRegistro, {
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
            });
        }
    }

    function manejarGoogle(respuesta) {
        try {
            const payload = JSON.parse(atob(respuesta.credential.split('.')[1]));
            const usuario = {
                usuario: payload.email.split('@')[0],
                nombre: payload.name,
                correo: payload.email,
                telefono: ''
            };

            let usuarios = obtenerUsuarios();
            if (!usuarios.find(u => u.correo === usuario.correo)) {
                usuarios.push(usuario);
                localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
            }

            establecerUsuario(usuario);
            cerrarModalAutenticacion();
            actualizarUsuario();
        } catch(e) {
            console.error('Error con Google:', e);
        }
    }

    function mostrarPestana(id) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        const el = document.getElementById(`${id}-tab`);
        if (el) {
            el.classList.add('active');
            desplazarSuavemente(`${id}-tab`);
        }
        if (id === 'carrito') mostrarCarrito();
        if (id === 'repair-quote') {
            setTimeout(() => document.getElementById('customer-name')?.focus(), 250);
        }
    }

    function alternarVisibilidadContraseña(idInput, idBoton) {
        const input = document.getElementById(idInput);
        const boton = document.getElementById(idBoton);
        if (!input || !boton) return;

        boton.addEventListener('click', function(e) {
            e.preventDefault();
            const esPassword = input.type === 'password';
            input.type = esPassword ? 'text' : 'password';
            boton.innerHTML = esPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
        });
    }

    function mostrarFormularioRecuperacion() {
        document.querySelectorAll('.auth-forms form').forEach(f => f.classList.remove('active'));
        document.getElementById('recover-password-form').classList.add('active');
        document.getElementById('tab-login').classList.remove('active');
        document.getElementById('tab-register').classList.remove('active');
    }

    function volverAlLogin() {
        document.querySelectorAll('.auth-forms form').forEach(f => f.classList.remove('active'));
        document.getElementById('login-form').classList.add('active');
        document.getElementById('tab-login').classList.add('active');
        document.getElementById('tab-register').classList.remove('active');
    }

    function enviarEnlaceRecuperacion(e) {
        e.preventDefault();
        const correo = (document.getElementById('recover-email').value || '').trim();
        const errorEl = document.getElementById('recover-error');

        if (!correo) {
            errorEl.textContent = 'Por favor ingresa tu correo.';
            return;
        }

        const usuarios = obtenerUsuarios();
        const encontrado = usuarios.find(u => u.correo === correo);

        if (encontrado) {
            errorEl.textContent = '';
            alert(`✅ Se envió un enlace de recuperación a ${correo}\n\n(En una app real, se enviaría un correo con un enlace de recuperación seguro)`);
            document.getElementById('recover-email').value = '';
            volverAlLogin();
        } else {
            errorEl.textContent = '❌ No encontramos una cuenta con ese correo.';
        }
    }

    function vincularEventos() {
        // Navegación
        document.querySelectorAll('.nav-link').forEach(link =>
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const tab = this.getAttribute('data-tab');
                if (tab) mostrarPestana(tab);
                cerrarMenuResponsive();
            })
        );

        if (menuToggleBtn && headerContainer) {
            menuToggleBtn.addEventListener('click', function() {
                const abierto = headerContainer.classList.toggle('nav-open');
                actualizarEstadoMenuResponsive(abierto);
            });
        }

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                cerrarMenuResponsive();
            }
        });

        // Productos
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('ver-producto')) {
                e.preventDefault();
                mostrarDetalleProducto(parseInt(e.target.getAttribute('data-id')));
            }
            if (e.target.classList.contains('agregar-carrito')) {
                e.preventDefault();
                agregarAlCarrito();
            }
        });

        // Tallas
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('size-option')) {
                document.querySelectorAll('.size-option').forEach(o => o.classList.remove('selected'));
                e.target.classList.add('selected');
            }
        });

        // Cantidad
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('quantity-btn')) {
                const input = e.target.parentElement.querySelector('.quantity-input');
                let valor = parseInt(input.value) || 1;
                if (e.target.classList.contains('decrease') && valor > 1) valor--;
                if (e.target.classList.contains('increase')) valor++;
                input.value = valor;
            }
        });

        // Carrito
        document.addEventListener('click', function(e) {
            // Debug: verificar qué elemento se clickeó
            const target = e.target;
            
            if (target.classList.contains('cart-menos')) {
                const idx = parseInt(target.getAttribute('data-idx'));
                if (!isNaN(idx) && carrito[idx] && carrito[idx].cantidad > 1) {
                    carrito[idx].cantidad--;
                    guardarCarrito();
                    mostrarCarrito();
                }
            }
            if (target.classList.contains('cart-mas')) {
                const idx = parseInt(target.getAttribute('data-idx'));
                if (!isNaN(idx) && carrito[idx]) {
                    carrito[idx].cantidad++;
                    guardarCarrito();
                    mostrarCarrito();
                }
            }
            if (target.classList.contains('remove-item')) {
                const idx = parseInt(target.getAttribute('data-idx'));
                if (!isNaN(idx) && idx >= 0 && idx < carrito.length) {
                    carrito.splice(idx, 1);
                    guardarCarrito();
                    mostrarCarrito();
                }
            }
        });

        // Reparaciones
        document.addEventListener('change', function(e) {
            if (e.target.classList.contains('repair-checkbox')) {
                actualizarCotizacion();
            }
        });

        const btnCot = document.getElementById('request-quote');
        if (btnCot) btnCot.addEventListener('click', function(e){
            e.preventDefault();
            enviarCotizacion(e);
        });

        const btnRepairStart = document.getElementById('repair-start-btn');
        if (btnRepairStart) {
            btnRepairStart.addEventListener('click', function() {
                mostrarPestana('repair-quote');
            });
        }

        // Toggle contraseñas
        alternarVisibilidadContraseña('auth-password', 'toggle-login-password');
        alternarVisibilidadContraseña('reg-password', 'toggle-register-password');

        // Recuperación de contraseña
        document.getElementById('forgot-password-link').addEventListener('click', function(e) {
            e.preventDefault();
            mostrarFormularioRecuperacion();
        });

        document.getElementById('back-to-login').addEventListener('click', function(e) {
            e.preventDefault();
            volverAlLogin();
        });

        const formRecuperar = document.getElementById('recover-password-form');
        if (formRecuperar) {
            formRecuperar.addEventListener('submit', enviarEnlaceRecuperacion);
        }

        // Autenticación
        document.getElementById('boton-usuario').addEventListener('click', function(e) {
            e.preventDefault();
            const usuario = obtenerUsuario();
            if (!usuario) {
                abrirModalAutenticacion('iniciar-sesion');
            } else {
                mostrarMenuUsuario();
            }
        });

        // Cerrar sesión
        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) {
            btnLogout.addEventListener('click', function(e) {
                e.preventDefault();
                cerrarSesion();
            });
        }

        // Cerrar menú si se hace clic fuera
        document.addEventListener('click', function(e) {
            const userMenuContainer = document.querySelector('.user-menu-container');
            const botonUsuario = document.getElementById('boton-usuario');
            if (userMenuContainer && !userMenuContainer.contains(e.target) && e.target !== botonUsuario) {
                cerrarMenuUsuario();
            }
        });

        document.getElementById('tab-login').addEventListener('click', function() {
            abrirModalAutenticacion('iniciar-sesion');
        });

        document.getElementById('tab-register').addEventListener('click', function() {
            abrirModalAutenticacion('registro');
        });

        document.getElementById('auth-close').addEventListener('click', cerrarModalAutenticacion);

        document.getElementById('login-form').addEventListener('submit', manejarInicioDeSesion);
        document.getElementById('register-form').addEventListener('submit', manejarRegistro);

        document.getElementById('checkout-btn').addEventListener('click', function(e) {
            e.preventDefault();
            if (!obtenerUsuario()) {
                abrirModalAutenticacion('iniciar-sesion');
            } else {
                alert('Procesando pago... (demo)');
            }
        });
    }
});
