document.addEventListener('DOMContentLoaded', function () {
    let carrito = [];
    let productoSeleccionado = null;

    // Datos de ejemplo
    const LISTA_PRODUCTOS = [
        { id: 1, name: 'Urban Classic Black', price: 89.99, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80', description: 'Zapatillas urbanas clásicas en color negro, perfectas para el día a día.', sizes: [7,8,9,10,11,12] },
        { id: 2, name: 'Sport White', price: 94.99, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=812&q=80', description: 'Zapatillas deportivas en blanco.', sizes: [6,7,8,9,10,11] },
        { id: 3, name: 'Black Pro', price: 99.99, image: 'https://images.unsplash.com/photo-1605030753481-bb38b08c384a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=749&q=80', description: 'Edición profesional en negro con refuerzos estratégicos.', sizes: [8,9,10,11,12,13] },
        { id: 4, name: 'Red Street', price: 87.99, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80', description: 'Zapatillas urbanas en rojo vibrante para destacar tu estilo.', sizes: [7,8,9,10,11] }
    ];

    const LISTA_SERVICIOS = [
        { servicio: 'Cambio de suela', descripcion: 'Reemplazo completo de la suela desgastada', precio: 25.00 },
        { servicio: 'Reparación de costuras', descripcion: 'Arreglo de costuras rotas o desgastadas', precio: 15.00 },
        { servicio: 'Reemplazo de cordones', descripcion: 'Cambio de cordones por unos nuevos', precio: 8.00 },
        { servicio: 'Limpieza profunda', descripcion: 'Limpieza completa y restauración de color', precio: 12.00 },
        { servicio: 'Reparación de cremallera', descripcion: 'Arreglo o reemplazo de cremallera dañada', precio: 18.00 },
        { servicio: 'Refuerzo de talón', descripcion: 'Refuerzo interno para mayor durabilidad', precio: 10.00 }
    ];

    const CLAVE_USUARIOS = 'mz_users_v1';
    const CLAVE_CARRITO_BASE = 'mz_cart_v1';
    const CLAVE_USUARIO_ACTUAL = 'mz_current_user_v1';

    // Google OAuth 2.0 Web Client ID (inserted by assistant per user)
    const GOOGLE_CLIENT_ID = '321766301291-k2ni9fbsm6ddmvte8otola8gro8lg92b.apps.googleusercontent.com';

    inicializarApp();

    function inicializarApp() {
        renderizarListaProductos();
        renderizarListaServicios();
        vincularListeners();
        cargarCarritoDesdeStorage();
        
        // Esperar a que la librería de Google esté disponible
        if (typeof google !== 'undefined') {
            iniciarGoogleSignIn();
        } else {
            // Reintentar cada 100ms hasta que Google esté disponible
            let intentos = 0;
            const esperarGoogle = setInterval(function() {
                intentos++;
                if (typeof google !== 'undefined') {
                    clearInterval(esperarGoogle);
                    iniciarGoogleSignIn();
                } else if (intentos > 50) {
                    // Después de 5 segundos, asumir que Google no se cargará
                    clearInterval(esperarGoogle);
                    console.warn('La librería de Google Identity no se pudo cargar después de 5 segundos');
                }
            }, 100);
        }
    }

    // ---------- Productos y búsqueda ----------
    function renderizarListaProductos() {
        const grid = document.querySelector('.products-grid');
        if (!grid) return;
        grid.innerHTML = '';
        LISTA_PRODUCTOS.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img"><img src="${p.image}" alt="${p.name}"></div>
                <div class="product-info">
                    <h3 class="product-title">${p.name}</h3>
                    <p class="product-price">$${p.price.toFixed(2)}</p>
                    <a href="#" class="btn view-product" data-id="${p.id}">Ver Detalles</a>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function buscarProductos(termino) {
        const q = (termino || '').trim().toLowerCase();
        const grid = document.querySelector('.products-grid');
        if (!grid) return;
        grid.innerHTML = '';
        if (!q) {
            renderizarListaProductos();
            return;
        }
        const resultados = LISTA_PRODUCTOS.filter(p =>
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q))
        );
        if (resultados.length === 0) {
            grid.innerHTML = `<div class="no-results"><p>No se encontraron productos para "${escapeHtml(q)}".</p></div>`;
            mostrarPestaña('products');
            return;
        }
        resultados.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img"><img src="${p.image}" alt="${p.name}"></div>
                <div class="product-info">
                    <h3 class="product-title">${p.name}</h3>
                    <p class="product-price">$${p.price.toFixed(2)}</p>
                    <a href="#" class="btn view-product" data-id="${p.id}">Ver Detalles</a>
                </div>
            `;
            grid.appendChild(card);
        });
        mostrarPestaña('products');
    }

    // ---------- Servicios ----------
    function renderizarListaServicios() {
        const cont = document.getElementById('repair-services');
        if (!cont) return;
        cont.innerHTML = '';
        LISTA_SERVICIOS.forEach((s, i) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${s.servicio}</td>
                <td>${s.descripcion}</td>
                <td class="repair-price">$${s.precio.toFixed(2)}</td>
                <td><div class="repair-option"><input type="checkbox" class="repair-checkbox" data-index="${i}" data-service="${s.servicio}" data-price="${s.precio}"></div></td>
            `;
            cont.appendChild(row);
        });
    }

    // ---------- Eventos y delegación ----------
    function vincularListeners() {
        document.querySelectorAll('.nav-link').forEach(link =>
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const tab = this.getAttribute('data-tab');
                mostrarPestaña(tab);
            })
        );

        document.addEventListener('click', function(e) {
            if (e.target.classList && e.target.classList.contains('view-product')) {
                e.preventDefault();
                const id = parseInt(e.target.getAttribute('data-id'));
                mostrarDetalleProducto(id);
            }
        });

        document.addEventListener('click', function(e) {
            if (e.target.classList && e.target.classList.contains('size-option')) {
                document.querySelectorAll('.size-option').forEach(o => o.classList.remove('selected'));
                e.target.classList.add('selected');
            }
        });

        document.addEventListener('click', function(e) {
            if (e.target.classList && e.target.classList.contains('quantity-btn')) {
                const input = e.target.parentElement.querySelector('.quantity-input');
                if (!input) return;
                let v = parseInt(input.value) || 1;
                if (e.target.classList.contains('decrease')) {
                    if (v > 1) v--;
                } else if (e.target.classList.contains('increase')) {
                    v++;
                }
                input.value = v;
            }
        });

        document.addEventListener('click', function(e) {
            if (e.target.classList && e.target.classList.contains('add-to-cart-detail')) {
                e.preventDefault();
                agregarProductoAlCarritoDesdeDetalle();
            }
        });

        document.addEventListener('change', function(e) {
            if (e.target.classList && e.target.classList.contains('repair-checkbox'))
                actualizarCotizacionReparacion();
        });

        const btnCot = document.getElementById('request-quote');
        if (btnCot) btnCot.addEventListener('click', function(e) {
            e.preventDefault();
            enviarSolicitudCotizacion();
        });

        document.addEventListener('click', function(e) {
            if (!e.target.classList) return;
            if (e.target.classList.contains('remove-item')) {
                const id = e.target.getAttribute('data-cart-id');
                eliminarDelCarritoPorId(id);
            }
            if (e.target.classList.contains('cart-decrease')) {
                const id = e.target.getAttribute('data-cart-id');
                cambiarCantidadCarritoPorId(id, -1);
            }
            if (e.target.classList.contains('cart-increase')) {
                const id = e.target.getAttribute('data-cart-id');
                cambiarCantidadCarritoPorId(id, 1);
            }
        });

        document.addEventListener('input', function(e) {
            if (e.target.classList && e.target.classList.contains('cart-quantity-input')) {
                const id = e.target.getAttribute('data-cart-id');
                const val = Math.max(1, parseInt(e.target.value) || 1);
                establecerCantidadCarritoPorId(id, val);
            }
        });

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!obtenerUsuarioSesion()) {
                abrirModalAuth('login');
                return;
            }
            alert('Procediendo al pago... (demo)');
        });

        vincularListenersAuth();
    }

    // ---------- Pestañas ----------
    function mostrarPestaña(idPestaña) {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        const el = document.getElementById(`${idPestaña}-tab`);
        if (el) el.classList.add('active');
        if (idPestaña === 'cart') renderizarVistaCarrito();
    }

    // ---------- Detalle de producto ----------
    function mostrarDetalleProducto(productId) {
        productoSeleccionado = LISTA_PRODUCTOS.find(p => p.id === productId);
        const cont = document.getElementById('product-detail-container');
        if (!cont || !productoSeleccionado) return;
        cont.innerHTML = `
            <div class="product-detail-image"><img src="${productoSeleccionado.image}" alt="${productoSeleccionado.name}"></div>
            <div class="product-detail-info">
                <h2>${productoSeleccionado.name}</h2>
                <p class="product-detail-price">$${productoSeleccionado.price.toFixed(2)}</p>
                <p class="product-detail-description">${productoSeleccionado.description}</p>
                <div class="size-selector"><h3>Selecciona tu talla:</h3><div class="size-options">${productoSeleccionado.sizes.map(s => `<div class="size-option" data-size="${s}">${s}</div>`).join('')}</div></div>
                <div class="quantity-selector"><h3>Cantidad:</h3><div class="quantity-controls"><button class="quantity-btn decrease">-</button><input type="number" class="quantity-input" value="1" min="1"><button class="quantity-btn increase">+</button></div></div>
                <button class="btn add-to-cart-detail">Añadir al Carrito</button>
            </div>
        `;
        mostrarPestaña('product-detail');
    }

    // ---------- Carrito ----------
    function agregarProductoAlCarritoDesdeDetalle() {
        const usuario = obtenerUsuarioSesion();
        if (!usuario) {
            abrirModalAuth('login');
            return;
        }
        const tallaEl = document.querySelector('.size-option.selected');
        const qtyEl = document.querySelector('.quantity-input');
        const cantidad = Math.max(1, parseInt(qtyEl && qtyEl.value) || 1);

        if (!tallaEl) {
            alert('Por favor, selecciona una talla.');
            return;
        }

        const talla = tallaEl.getAttribute('data-size');
        const idx = carrito.findIndex(i => i.productId === productoSeleccionado.id && String(i.size) === String(talla));

        if (idx !== -1) {
            carrito[idx].cantidad += cantidad;
        } else {
            carrito.push({
                productId: productoSeleccionado.id,
                name: productoSeleccionado.name,
                price: productoSeleccionado.price,
                size: talla,
                cantidad: cantidad,
                image: productoSeleccionado.image
            });
        }

        guardarCarritoEnStorage();
        mostrarPestaña('cart');
        alert('Producto añadido al carrito.');
    }

    function renderizarVistaCarrito() {
        const cont = document.getElementById('cart-items');
        const summ = document.getElementById('cart-summary');
        if (!cont) return;

        if (carrito.length === 0) {
            document.getElementById('empty-cart-message').style.display = 'block';
            summ.style.display = 'none';
            cont.innerHTML = '<div class="empty-cart-message" id="empty-cart-message"><p>Tu carrito está vacío. <a href="#" class="nav-link" data-tab="products">¡Agrega algunos productos!</a></p></div>';
            return;
        }

        document.getElementById('empty-cart-message').style.display = 'none';
        summ.style.display = 'block';

        cont.innerHTML = carrito.map((item, i) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Talla: ${item.size}</p>
                    <p>Precio: $${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn cart-decrease" data-cart-id="${i}">-</button>
                    <input type="number" class="quantity-input cart-quantity-input" data-cart-id="${i}" value="${item.cantidad}" min="1">
                    <button class="quantity-btn cart-increase" data-cart-id="${i}">+</button>
                </div>
                <div class="cart-item-total">$${(item.price * item.cantidad).toFixed(2)}</div>
                <button class="remove-item" data-cart-id="${i}">Eliminar</button>
            </div>
        `).join('');

        const subtotal = carrito.reduce((sum, item) => sum + (item.price * item.cantidad), 0);
        const envio = subtotal > 100 ? 0 : 10;
        const total = subtotal + envio;

        document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cart-shipping').textContent = `$${envio.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    }

    function eliminarDelCarritoPorId(id) {
        const idx = parseInt(id);
        if (idx >= 0 && idx < carrito.length) {
            carrito.splice(idx, 1);
            guardarCarritoEnStorage();
            renderizarVistaCarrito();
        }
    }

    function cambiarCantidadCarritoPorId(id, delta) {
        const idx = parseInt(id);
        if (idx >= 0 && idx < carrito.length) {
            carrito[idx].cantidad = Math.max(1, carrito[idx].cantidad + delta);
            guardarCarritoEnStorage();
            renderizarVistaCarrito();
        }
    }

    function establecerCantidadCarritoPorId(id, nuevaCantidad) {
        const idx = parseInt(id);
        if (idx >= 0 && idx < carrito.length) {
            carrito[idx].cantidad = Math.max(1, nuevaCantidad);
            guardarCarritoEnStorage();
            renderizarVistaCarrito();
        }
    }

    function obtenerClaveCarrito() {
        const cur = obtenerUsuarioSesion();
        if (cur && (cur.username || cur.email)) {
            const id = cur.username || cur.email;
            return `${CLAVE_CARRITO_BASE}_${id}`;
        }
        return `${CLAVE_CARRITO_BASE}_guest`;
    }

    function guardarCarritoEnStorage() {
        try {
            localStorage.setItem(obtenerClaveCarrito(), JSON.stringify(carrito || []));
        } catch(e) {
            console.warn('No se pudo guardar el carrito', e);
        }
    }

    function cargarCarritoDesdeStorage() {
        try {
            carrito = JSON.parse(localStorage.getItem(obtenerClaveCarrito())) || [];
        } catch(e) {
            carrito = [];
        }
    }

    // ---------- Autenticación ----------
    function abrirModalAuth(modo = 'login') {
        const modal = document.getElementById('auth-modal');
        if (!modal) return;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        const tabLogin = document.getElementById('tab-login');
        const tabRegister = document.getElementById('tab-register');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const authError = document.getElementById('auth-error');
        const regError = document.getElementById('reg-error');

        if (tabLogin) tabLogin.classList.toggle('active', modo === 'login');
        if (tabRegister) tabRegister.classList.toggle('active', modo === 'register');
        if (loginForm) loginForm.classList.toggle('active', modo === 'login');
        if (registerForm) registerForm.classList.toggle('active', modo === 'register');
        if (authError) authError.textContent = '';
        if (regError) regError.textContent = '';
    }

    function cerrarModalAuth() {
        const modal = document.getElementById('auth-modal');
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }

    function manejarRegistro(e) {
        e.preventDefault();
        const username = (document.getElementById('reg-username').value || '').trim();
        const password = (document.getElementById('reg-password').value || '');
        const name = (document.getElementById('reg-name').value || '').trim();
        const email = (document.getElementById('reg-email').value || '').trim();
        const phone = (document.getElementById('reg-phone').value || '').trim();
        const err = document.getElementById('reg-error');

        if (!username || !password || !name || !email) {
            if (err) err.textContent = 'Completa todos los campos obligatorios.';
            return;
        }

        if (password.length < 6) {
            if (err) err.textContent = 'La contraseña debe tener al menos 6 caracteres.';
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            if (err) err.textContent = 'Correo electrónico inválido.';
            return;
        }

        const usuarios = obtenerUsuarios();
        if (usuarios.find(u => u.username === username)) {
            if (err) err.textContent = 'El usuario ya existe.';
            return;
        }

        if (usuarios.find(u => u.email === email)) {
            if (err) err.textContent = 'El correo ya está registrado.';
            return;
        }

        const nuevoUsuario = { username, password, name, email, phone: phone || '', birth: '', country: '', curp: '' };
        usuarios.push(nuevoUsuario);
        guardarUsuarios(usuarios);
        establecerUsuarioSesion(nuevoUsuario);
        cerrarModalAuth();
        mostrarEstadoUsuario();
    }

    function manejarLogin(e) {
        e.preventDefault();
        const email = (document.getElementById('auth-email').value || '').trim();
        const password = (document.getElementById('auth-password').value || '');
        const err = document.getElementById('auth-error');
        const spinner = document.getElementById('auth-loading');
        const loginBtn = document.getElementById('login-btn');

        if (!email || !password) {
            if (err) err.textContent = 'Completa tu correo y contraseña.';
            return;
        }

        if (err) err.textContent = '';

        if (spinner) {
            spinner.setAttribute('aria-hidden', 'false');
            spinner.classList.add('active');
        }
        if (loginBtn) loginBtn.disabled = true;

        setTimeout(function() {
            const usuarios = obtenerUsuarios();
            const encontrado = usuarios.find(u => u.email === email && u.password === password);

            if (encontrado) {
                establecerUsuarioSesion({
                    username: encontrado.username,
                    name: encontrado.name,
                    email: encontrado.email,
                    phone: encontrado.phone,
                    birth: encontrado.birth,
                    country: encontrado.country,
                    curp: encontrado.curp
                });
                if (spinner) {
                    spinner.setAttribute('aria-hidden', 'true');
                    spinner.classList.remove('active');
                }
                if (loginBtn) loginBtn.disabled = false;
                cerrarModalAuth();
                mostrarEstadoUsuario();
            } else {
                if (err) err.textContent = 'Correo o contraseña incorrectos.';
                if (spinner) {
                    spinner.setAttribute('aria-hidden', 'true');
                    spinner.classList.remove('active');
                }
                if (loginBtn) loginBtn.disabled = false;
            }
        }, 700);
    }

    // ---------- Estado Usuario UI ----------
    function mostrarEstadoUsuario() {
        const botonUsuario = document.getElementById('user-button');
        const actual = obtenerUsuarioSesion();
        if (!botonUsuario) return;
        if (actual && (actual.username || actual.name || actual.email)) {
            const avatarHtml = actual.picture
                ? `<img src="${escapeHtml(actual.picture)}" alt="avatar" class="user-avatar" />`
                : `<i class="fas fa-user-circle" style="font-size:20px;color:var(--primary)"></i>`;
            botonUsuario.innerHTML = `<button class="user-badge" id="user-badge-button" style="border:none;background:transparent;cursor:pointer;display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:20px;">${avatarHtml}<div style="display:flex;flex-direction:column;align-items:flex-start;"><span style="font-weight:600;color:var(--primary);font-size:0.95rem;">${escapeHtml(actual.name || actual.username)}</span><span style="font-size:0.75rem;color:#666;">${escapeHtml(actual.username || '')}</span></div></button>`;
            const badge = document.getElementById('user-badge-button');
            if (badge) badge.addEventListener('click', function(e) {
                e.preventDefault();
                abrirModalPerfil();
            });
        } else {
            botonUsuario.innerHTML = '<i class="fas fa-user"></i>';
        }
    }

    // ---------- Modal perfil ----------
    function abrirModalPerfil() {
        const actual = obtenerUsuarioSesion();
        const cont = document.querySelector('.auth-forms');
        const ORIGINAL = cont ? cont.innerHTML : '';
        if (!cont) return;

        const html = `
            <div style="padding:8px 12px; text-align:center;">
                ${actual && actual.picture ? `<div style="margin-bottom:8px;"><img src="${escapeHtml(actual.picture)}" alt="avatar" style="width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid #f0f0f0" /></div>` : ''}
                <h3 style="margin-bottom:6px;text-align:center;">${escapeHtml(actual.name || actual.username || '')}</h3>
                <p style="color:#666;margin-bottom:6px;text-align:center;">Usuario: <b>${escapeHtml(actual.username || '')}</b></p>
                <div class="form-group"><label for="profile-email">Correo</label><input id="profile-email" type="email" class="form-control" style="width:100%;" value="${escapeHtml(actual.email || '')}" /></div>
                <div class="form-group"><label for="profile-phone">Teléfono</label><input id="profile-phone" type="tel" class="form-control" style="width:100%;" value="${escapeHtml(actual.phone || '')}" /></div>
                <fieldset style="border:1px dashed #e0e0e0;padding:8px;margin-top:8px;"><legend style="font-size:0.9em;color:#666;padding:0 6px;">Cambiar contraseña</legend><div class="form-group"><label for="profile-current-password">Contraseña actual</label><input id="profile-current-password" type="password" class="form-control" /></div><div class="form-group"><label for="profile-new-password">Nueva contraseña</label><input id="profile-new-password" type="password" class="form-control" /></div><div class="form-group"><label for="profile-new-password-confirm">Confirmar nueva contraseña</label><input id="profile-new-password-confirm" type="password" class="form-control" /></div></fieldset>
                <div style="margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;"><button class="btn" id="profile-save-changes">Guardar cambios</button><button class="btn" id="profile-logout">Cerrar sesión</button><button class="btn btn-secondary" id="profile-close">Cerrar</button></div>
                <div id='profile-msg' style='margin-top:8px;color:var(--secondary);font-weight:600;text-align:center;'></div>
            </div>
        `;
        cont.innerHTML = html;
        abrirModalAuth('profile');

        const guardarBtn = document.getElementById('profile-save-changes');
        if (guardarBtn) guardarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const msg = document.getElementById('profile-msg');
            const nuevoEmail = (document.getElementById('profile-email').value || '').trim();
            const nuevoPhone = (document.getElementById('profile-phone').value || '').trim();
            const curPass = (document.getElementById('profile-current-password').value || '');
            const newPass = (document.getElementById('profile-new-password').value || '');
            const newPassConfirm = (document.getElementById('profile-new-password-confirm').value || '');

            if (!/^\S+@\S+\.\S+$/.test(nuevoEmail)) {
                if (msg) msg.textContent = 'Correo electrónico inválido.';
                return;
            }
            if (nuevoPhone && !/^\d{10}$/.test(nuevoPhone)) {
                if (msg) msg.textContent = 'El teléfono debe tener 10 dígitos.';
                return;
            }

            let usuarios = obtenerUsuarios();
            const idx = usuarios.findIndex(x => x.username === actual.username);
            if (idx === -1) {
                if (msg) msg.textContent = 'Usuario no encontrado.';
                return;
            }

            const other = usuarios.find((u, i) => (u.email === nuevoEmail) && i !== idx);
            if (other) {
                if (msg) msg.textContent = 'El correo ya está en uso por otra cuenta.';
                return;
            }

            if (newPass || newPassConfirm) {
                if (!curPass) {
                    if (msg) msg.textContent = 'Proporciona tu contraseña actual para cambiarla.';
                    return;
                }
                if (usuarios[idx].password !== curPass) {
                    if (msg) msg.textContent = 'Contraseña actual incorrecta.';
                    return;
                }
                if (newPass.length < 6) {
                    if (msg) msg.textContent = 'La nueva contraseña debe tener al menos 6 caracteres.';
                    return;
                }
                if (newPass !== newPassConfirm) {
                    if (msg) msg.textContent = 'Las nuevas contraseñas no coinciden.';
                    return;
                }
                usuarios[idx].password = newPass;
            }

            usuarios[idx].email = nuevoEmail;
            usuarios[idx].phone = nuevoPhone;
            guardarUsuarios(usuarios);
            establecerUsuarioSesion({
                username: usuarios[idx].username,
                name: usuarios[idx].name,
                email: usuarios[idx].email,
                phone: usuarios[idx].phone,
                birth: usuarios[idx].birth,
                country: usuarios[idx].country,
                curp: usuarios[idx].curp
            });
            if (msg) msg.textContent = 'Datos actualizados correctamente.';
            mostrarEstadoUsuario();
        });

        const logoutBtn = document.getElementById('profile-logout');
        const closeBtn = document.getElementById('profile-close');
        if (logoutBtn) logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            limpiarUsuarioSesion();
            cerrarModalAuth();
            if (cont) cont.innerHTML = ORIGINAL;
            vincularListenersAuth();
        });
        if (closeBtn) closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            cerrarModalAuth();
            if (cont) cont.innerHTML = ORIGINAL;
            vincularListenersAuth();
        });
    }

    window.abrirModalPerfil = abrirModalPerfil;
    window.openProfileModal = abrirModalPerfil;

    function escapeHtml(text) {
        return String(text).replace(/[&<>"]/g, function(s) {
            return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[s];
        });
    }

    // ---------- Listeners auth ----------
    function vincularListenersAuth() {
        const cont = document.querySelector('.auth-forms');
        const ORIGINAL = cont ? cont.innerHTML : '';
        const btnUsuario = document.getElementById('user-button');
        if (btnUsuario) btnUsuario.addEventListener('click', function(e) {
            e.preventDefault();
            const cur = obtenerUsuarioSesion();
            if (cur && cur.username) {
                // ya logueado
            } else {
                abrirModalAuth('login');
            }
        });

        const authClose = document.getElementById('auth-close');
        if (authClose) authClose.addEventListener('click', function(e) {
            e.preventDefault();
            cerrarModalAuth();
        });

        const tabLogin = document.getElementById('tab-login');
        const tabRegister = document.getElementById('tab-register');
        if (tabLogin) tabLogin.addEventListener('click', function() { abrirModalAuth('login'); });
        if (tabRegister) tabRegister.addEventListener('click', function() { abrirModalAuth('register'); });

        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        if (loginForm) loginForm.addEventListener('submit', manejarLogin);
        if (registerForm) registerForm.addEventListener('submit', manejarRegistro);
    }

    // ---------- Usuarios en localStorage ----------
    function obtenerUsuarios() {
        try {
            return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
        } catch(e) {
            return [];
        }
    }

    function guardarUsuarios(usuarios) {
        try {
            localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
        } catch(e) {
            console.warn('No se pudo guardar usuarios', e);
        }
    }

    function obtenerUsuarioSesion() {
        try {
            const data = localStorage.getItem(CLAVE_USUARIO_ACTUAL);
            return data ? JSON.parse(data) : null;
        } catch(e) {
            return null;
        }
    }

    function establecerUsuarioSesion(usuario) {
        try {
            localStorage.setItem(CLAVE_USUARIO_ACTUAL, JSON.stringify(usuario));
        } catch(e) {
            console.warn('No se pudo establecer usuario sesión', e);
        }
    }

    function limpiarUsuarioSesion() {
        try {
            localStorage.removeItem(CLAVE_USUARIO_ACTUAL);
        } catch(e) {
            console.warn('No se pudo limpiar sesión', e);
        }
    }

    // ---------- Google Sign-In ----------
    function iniciarGoogleSignIn() {
        console.log('Inicializando Google Sign-In...');

        // Verificar si la librería de Google está disponible
        if (typeof google === 'undefined') {
            console.error('La librería de Google Identity no está disponible');
            mostrarFallbackGoogleButtons();
            return;
        }

        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('REPLACE_WITH')) {
            console.error('GOOGLE_CLIENT_ID no configurado correctamente.');
            mostrarFallbackGoogleButtons();
            return;
        }

        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: manejarCredencialGoogle,
            auto_select: false,
            cancel_on_tap_outside: true,
        });

        const loginContainer = document.getElementById('google-signin-button');
        const registerContainer = document.getElementById('google-register-button');

        if (!loginContainer) {
            console.error('Contenedor de login no encontrado: #google-signin-button');
        } else {
            console.log('Renderizando botón de Google en login...');
            google.accounts.id.renderButton(
                loginContainer,
                {
                    theme: 'outline',
                    size: 'large',
                    text: 'signin_with',
                    logo_alignment: 'left',
                }
            );
        }

        if (!registerContainer) {
            console.error('Contenedor de registro no encontrado: #google-register-button');
        } else {
            console.log('Renderizando botón de Google en registro...');
            google.accounts.id.renderButton(
                registerContainer,
                {
                    theme: 'outline',
                    size: 'large',
                    text: 'signin_with',
                    logo_alignment: 'left',
                }
            );
        }

        // Fallback si los botones no se renderizan después de 2 segundos
        setTimeout(() => {
            if (loginContainer && loginContainer.children.length === 0) {
                console.warn('El botón de Google (login) no se renderizó. Mostrando botón alternativo.');
                const fallbackLoginButton = document.createElement('button');
                fallbackLoginButton.textContent = 'Iniciar sesión con Google';
                fallbackLoginButton.className = 'btn btn-google';
                fallbackLoginButton.onclick = () => {
                    if (typeof google !== 'undefined') google.accounts.id.prompt();
                };
                loginContainer.appendChild(fallbackLoginButton);
            }

            if (registerContainer && registerContainer.children.length === 0) {
                console.warn('El botón de Google (registro) no se renderizó. Mostrando botón alternativo.');
                const fallbackRegisterButton = document.createElement('button');
                fallbackRegisterButton.textContent = 'Registrarse con Google';
                fallbackRegisterButton.className = 'btn btn-google';
                fallbackRegisterButton.onclick = () => {
                    if (typeof google !== 'undefined') google.accounts.id.prompt();
                };
                registerContainer.appendChild(fallbackRegisterButton);
            }
        }, 2000);
    }

    function mostrarFallbackGoogleButtons() {
        const loginContainer = document.getElementById('google-signin-button');
        const registerContainer = document.getElementById('google-register-button');

        if (loginContainer && loginContainer.children.length === 0) {
            const fallbackLoginButton = document.createElement('button');
            fallbackLoginButton.textContent = 'Iniciar sesión con Google';
            fallbackLoginButton.className = 'btn btn-google';
            fallbackLoginButton.onclick = () => alert('La librería de Google Identity no se pudo cargar. Verifica tu conexión a internet.');
            loginContainer.appendChild(fallbackLoginButton);
        }

        if (registerContainer && registerContainer.children.length === 0) {
            const fallbackRegisterButton = document.createElement('button');
            fallbackRegisterButton.textContent = 'Registrarse con Google';
            fallbackRegisterButton.className = 'btn btn-google';
            fallbackRegisterButton.onclick = () => alert('La librería de Google Identity no se pudo cargar. Verifica tu conexión a internet.');
            registerContainer.appendChild(fallbackRegisterButton);
        }
    }

    function manejarCredencialGoogle(response) {
        console.log('Credencial de Google recibida');
        try {
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            console.log('Datos decodificados:', payload);

            const usuario = {
                username: payload.email.split('@')[0],
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                phone: '',
                birth: '',
                country: '',
                curp: ''
            };

            let usuarios = obtenerUsuarios();
            const encontrado = usuarios.find(u => u.email === usuario.email);
            if (!encontrado) {
                usuarios.push(usuario);
                guardarUsuarios(usuarios);
                console.log('Usuario Google registrado automáticamente');
            } else {
                usuario.password = encontrado.password;
            }

            establecerUsuarioSesion(usuario);
            cerrarModalAuth();
            mostrarEstadoUsuario();
        } catch(e) {
            console.error('Error procesando credencial Google:', e);
        }
    }

    // ---------- Reparación ----------
    function enviarSolicitudCotizacion() {
        const seleccionadas = document.querySelectorAll('.repair-checkbox:checked');
        const nombre = document.getElementById('customer-name') ? document.getElementById('customer-name').value : '';
        const correo = document.getElementById('customer-email') ? document.getElementById('customer-email').value : '';

        if (seleccionadas.length === 0) {
            alert('Por favor, selecciona al menos un servicio de reparación.');
            return;
        }
        if (!nombre || !correo) {
            alert('Por favor, completa tu nombre y correo electrónico.');
            return;
        }

        let total = 0;
        let lista = '';
        seleccionadas.forEach(cb => {
            const serv = cb.getAttribute('data-service');
            const precio = parseFloat(cb.getAttribute('data-price')) || 0;
            total += precio;
            lista += `- ${serv}: $${precio.toFixed(2)}\n`;
        });

        alert(`✅ Cotización solicitada exitosamente!\n\n📋 Servicios seleccionados:\n${lista}\n💰 Total estimado: $${total.toFixed(2)}\n\n📧 Te contactaremos pronto a ${correo} para confirmar los detalles.`);

        document.querySelectorAll('.repair-checkbox').forEach(cb => cb.checked = false);
        if (document.getElementById('customer-name')) document.getElementById('customer-name').value = '';
        if (document.getElementById('customer-email')) document.getElementById('customer-email').value = '';
        if (document.getElementById('customer-phone')) document.getElementById('customer-phone').value = '';
        if (document.getElementById('repair-description')) document.getElementById('repair-description').value = '';
        actualizarCotizacionReparacion();
    }

    function actualizarCotizacionReparacion() {
        const checks = document.querySelectorAll('.repair-checkbox:checked');
        let total = 0;
        checks.forEach(c => {
            total += parseFloat(c.getAttribute('data-price')) || 0;
        });
        const el = document.getElementById('repair-quote-total');
        if (el) el.textContent = `$${total.toFixed(2)}`;
    }
});
