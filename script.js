document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let cart = [];
    let currentProduct = null;
    
    // Datos de productos
    const products = [
        {
            id: 1,
            name: "Urban Classic Black",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
            description: "Zapatillas urbanas clásicas en color negro, perfectas para el día a día. Fabricadas con materiales de alta calidad y diseño ergonómico para máximo confort.",
            sizes: [7, 8, 9, 10, 11, 12]
        },
        {
            id: 2,
            name: "Sport White",
            price: 94.99,
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=812&q=80",
            description: "Zapatillas deportivas en blanco con detalles en colores vibrantes. Ideales para actividades deportivas y uso casual.",
            sizes: [6, 7, 8, 9, 10, 11]
        },
        {
            id: 3,
            name: "Black Pro",
            price: 99.99,
            image: "https://images.unsplash.com/photo-1605030753481-bb38b08c384a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=749&q=80",
            description: "Edición profesional en negro con refuerzos estratégicos. Diseñadas para durabilidad y estilo urbano.",
            sizes: [8, 9, 10, 11, 12, 13]
        },
        {
            id: 4,
            name: "Red Street",
            price: 87.99,
            image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
            description: "Zapatillas urbanas en rojo vibrante para destacar tu estilo. Combinación perfecta entre comodidad y diseño llamativo.",
            sizes: [7, 8, 9, 10, 11]
        }
    ];

    // Datos de servicios de reparación
    const repairServices = [
        {
            service: "Cambio de suela",
            description: "Reemplazo completo de la suela desgastada",
            price: 25.00
        },
        {
            service: "Reparación de costuras",
            description: "Arreglo de costuras rotas o desgastadas",
            price: 15.00
        },
        {
            service: "Reemplazo de cordones",
            description: "Cambio de cordones por unos nuevos",
            price: 8.00
        },
        {
            service: "Limpieza profunda",
            description: "Limpieza completa y restauración de color",
            price: 12.00
        },
        {
            service: "Reparación de cremallera",
            description: "Arreglo o reemplazo de cremallera dañada",
            price: 18.00
        },
        {
            service: "Refuerzo de talón",
            description: "Refuerzo interno para mayor durabilidad",
            price: 10.00
        }
    ];
  
    init();

    function init() {
        loadProducts();
        loadRepairServices();
        setupEventListeners();
        showTab('home');
    }

    function loadProducts() {
        const productsGrid = document.querySelector('.products-grid');
        productsGrid.innerHTML = '';

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <a href="#" class="btn view-product" data-id="${product.id}">Ver Detalles</a>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
    }

    function loadRepairServices() {
        const repairServicesContainer = document.getElementById('repair-services');
        repairServicesContainer.innerHTML = '';

        repairServices.forEach((service, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service.service}</td>
                <td>${service.description}</td>
                <td class="repair-price">$${service.price.toFixed(2)}</td>
                <td>
                    <div class="repair-option">
                        <input type="checkbox" class="repair-checkbox" data-index="${index}" data-service="${service.service}" data-price="${service.price}">
                    </div>
                </td>
            `;
            repairServicesContainer.appendChild(row);
        });
    }

    function setupEventListeners() {
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                showTab(tabId);
            });
        });

        // Ver detalles del producto
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('view-product')) {
                e.preventDefault();
                const productId = parseInt(e.target.getAttribute('data-id'));
                showProductDetail(productId);
            }
        });

        // Selección de talla
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('size-option')) {
                const sizeOptions = document.querySelectorAll('.size-option');
                sizeOptions.forEach(option => option.classList.remove('selected'));
                e.target.classList.add('selected');
            }
        });

        // Controles de cantidad
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('quantity-btn')) {
                const input = e.target.parentElement.querySelector('.quantity-input');
                let value = parseInt(input.value);

                if (e.target.classList.contains('decrease')) {
                    if (value > 1) value--;
                } else if (e.target.classList.contains('increase')) {
                    value++;
                }

                input.value = value;
            }
        });

        // Añadir al carrito desde vista detallada
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart-detail')) {
                e.preventDefault();
                addToCartFromDetail();
            }
        });

        // Servicios de reparación
        document.addEventListener('change', function(e) {
            if (e.target.classList.contains('repair-checkbox')) {
                updateRepairQuote();
            }
        });

        // Solicitar cotización
        document.getElementById('request-quote').addEventListener('click', function(e) {
            e.preventDefault();
            submitRepairQuote();
        });

        // Carrito
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-item')) {
                const productId = e.target.getAttribute('data-id');
                removeFromCart(productId);
            }
        });
    }

    function showTab(tabId) {
        // Ocultar todas las pestañas
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Mostrar la pestaña seleccionada
        document.getElementById(`${tabId}-tab`).classList.add('active');

        // Actualizar vista del carrito si es necesario
        if (tabId === 'cart') {
            updateCartView();
        }
    }

    function showProductDetail(productId) {
        currentProduct = products.find(p => p.id === productId);
        
        const detailContainer = document.getElementById('product-detail-container');
        detailContainer.innerHTML = `
            <div class="product-detail-image">
                <img src="${currentProduct.image}" alt="${currentProduct.name}">
            </div>
            <div class="product-detail-info">
                <h2>${currentProduct.name}</h2>
                <p class="product-detail-price">$${currentProduct.price.toFixed(2)}</p>
                <p class="product-detail-description">${currentProduct.description}</p>
                
                <div class="size-selector">
                    <h3>Selecciona tu talla:</h3>
                    <div class="size-options">
                        ${currentProduct.sizes.map(size => `
                            <div class="size-option" data-size="${size}">${size}</div>
                        `).join('')}
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
                
                <button class="btn add-to-cart-detail">Añadir al Carrito</button>
            </div>
        `;

        showTab('product-detail');
    }

    function addToCartFromDetail() {
        const selectedSize = document.querySelector('.size-option.selected');
        const quantity = parseInt(document.querySelector('.quantity-input').value);

        if (!selectedSize) {
            alert('Por favor, selecciona una talla.');
            return;
        }

        const size = selectedSize.getAttribute('data-size');
        
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            quantity: quantity,
            size: size,
            image: currentProduct.image
        });

        alert(`${currentProduct.name} (Talla: ${size}) añadido al carrito!`);
        showTab('cart');
    }

    function updateRepairQuote() {
        const selectedServices = document.querySelectorAll('.repair-checkbox:checked');
        let total = 0;
        let servicesList = '';

        selectedServices.forEach(checkbox => {
            const service = checkbox.getAttribute('data-service');
            const price = parseFloat(checkbox.getAttribute('data-price'));
            total += price;
            servicesList += `<p>• ${service}: $${price.toFixed(2)}</p>`;
        });

        const summaryDetails = document.getElementById('summary-details');
        const summaryTotal = document.getElementById('summary-total');

        if (selectedServices.length > 0) {
            summaryDetails.innerHTML = servicesList;
            summaryTotal.textContent = `Total: $${total.toFixed(2)}`;
        } else {
            summaryDetails.innerHTML = '<p>Selecciona servicios para ver el total</p>';
            summaryTotal.textContent = 'Total: $0.00';
        }
    }

    function submitRepairQuote() {
        const selectedServices = document.querySelectorAll('.repair-checkbox:checked');
        const customerName = document.getElementById('customer-name').value;
        const customerEmail = document.getElementById('customer-email').value;

        if (selectedServices.length === 0) {
            alert('Por favor, selecciona al menos un servicio de reparación.');
            return;
        }

        if (!customerName || !customerEmail) {
            alert('Por favor, completa tu nombre y correo electrónico.');
            return;
        }

        let total = 0;
        let servicesList = '';

        selectedServices.forEach(checkbox => {
            const service = checkbox.getAttribute('data-service');
            const price = parseFloat(checkbox.getAttribute('data-price'));
            total += price;
            servicesList += `- ${service}: $${price.toFixed(2)}\n`;
        });

        alert(`✅ Cotización solicitada exitosamente!\n\n📋 Servicios seleccionados:\n${servicesList}\n💰 Total estimado: $${total.toFixed(2)}\n\n📧 Te contactaremos pronto a ${customerEmail} para confirmar los detalles.`);

        // Limpiar formulario
        document.querySelectorAll('.repair-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        document.getElementById('customer-name').value = '';
        document.getElementById('customer-email').value = '';
        document.getElementById('customer-phone').value = '';
        document.getElementById('repair-description').value = '';
        updateRepairQuote();
    }

    function updateCartView() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartSummary = document.getElementById('cart-summary');

        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartSummary.style.display = 'none';
            return;
        }

        emptyCartMessage.style.display = 'none';
        cartSummary.style.display = 'block';

        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">Talla: ${item.size} | $${item.price.toFixed(2)} c/u</div>
                    <div class="cart-item-quantity">
                        <span>Cantidad: ${item.quantity}</span>
                        <span class="cart-item-remove remove-item" data-id="${item.id}">Eliminar</span>
                    </div>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        const shipping = subtotal > 0 ? 5.00 : 0;
        const total = subtotal + shipping;

        document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cart-shipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== parseInt(productId));
        updateCartView();
    }

    /* ---------------------- Authentication (client-side) ---------------------- */
    const USERS_KEY = 'mz_users_v1';
    const CURRENT_USER_KEY = 'mz_current_user_v1';

    function getUsers() {
        try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch(e) { return []; }
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function getCurrentUser() {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    }

    function setCurrentUser(user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }

    function clearCurrentUser() {
        localStorage.removeItem(CURRENT_USER_KEY);
    }

    function openAuthModal(mode = 'login') {
        const modal = document.getElementById('auth-modal');
        if (!modal) return;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        // switch tab
        const tabLogin = document.getElementById('tab-login');
        const tabRegister = document.getElementById('tab-register');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const authError = document.getElementById('auth-error');
        const regError = document.getElementById('reg-error');
        if (tabLogin) tabLogin.classList.toggle('active', mode === 'login');
        if (tabRegister) tabRegister.classList.toggle('active', mode === 'register');
        if (loginForm) loginForm.classList.toggle('active', mode === 'login');
        if (registerForm) registerForm.classList.toggle('active', mode === 'register');
        if (authError) authError.textContent = '';
        if (regError) regError.textContent = '';
    }

    function closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }

    function showUserState() {
        const userBtn = document.getElementById('user-button');
        const current = getCurrentUser();
        if (!userBtn) return;

        if (current && (current.username || current.name || current.email)) {
            const displayName = current.name || current.username || current.email || 'Usuario';
            const picture = current.picture ? `<img src="${escapeHtml(current.picture)}" alt="${escapeHtml(displayName)}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">` : '';
            userBtn.innerHTML = `<button class="user-badge" id="user-badge-button" style="border:none;background:transparent;cursor:pointer;display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:20px;">${picture}<span style="font-weight:600;color:var(--primary);">${escapeHtml(displayName)}</span></button>`;
            // clicking the badge opens profile modal
            const badge = document.getElementById('user-badge-button');
            if (badge) badge.addEventListener('click', function(e){ e.preventDefault(); openProfileModal(); });
        } else {
            userBtn.innerHTML = '<i class="fas fa-user"></i>';
        }
    }

    function escapeHtml(text){
        return String(text).replace(/[&<>"]/g, function(s){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[s]; });
    }

    function handleLogin(e) {
        e.preventDefault();
        const u = document.getElementById('auth-username').value.trim();
        const p = document.getElementById('auth-password').value;
        const err = document.getElementById('auth-error');

        if (!u || !p) {
            err.textContent = 'Completa usuario y contraseña.';
            return;
        }

        const users = getUsers();
        const found = users.find(x => x.username === u && x.password === p);
        if (found) {
            setCurrentUser({ username: found.username });
            closeAuthModal();
            showUserState();
        } else {
            err.textContent = 'Usuario o contraseña incorrectos.';
        }
    }

    function handleRegister(e) {
        e.preventDefault();
        const u = document.getElementById('reg-username').value.trim();
        const p = document.getElementById('reg-password').value;
        const err = document.getElementById('reg-error');

        if (!u || !p) { err.textContent = 'Completa usuario y contraseña.'; return; }

        let users = getUsers();
        if (users.find(x => x.username === u)) { err.textContent = 'El usuario ya existe.'; return; }

        users.push({ username: u, password: p });
        saveUsers(users);
        setCurrentUser({ username: u });
        closeAuthModal();
        showUserState();
    }

    function logout() {
        clearCurrentUser();
        showUserState();
    }

    // Wire auth listeners into existing setupEventListeners flow
    // Add auth-specific listeners
    (function attachAuthListeners(){
        // keep original auth-forms markup to restore after showing profile
        const authFormsContainer = document.querySelector('.auth-forms');
        const ORIGINAL_AUTH_FORMS = authFormsContainer ? authFormsContainer.innerHTML : '';

        // user button opens modal
        const userBtn = document.getElementById('user-button');
        if (userBtn) userBtn.addEventListener('click', function(e){ e.preventDefault(); const cur = getCurrentUser(); if (cur && cur.username) { /* no modal when logged, allow logout via badge */ } else openAuthModal('login'); });

        // close modal
        const authClose = document.getElementById('auth-close');
        if (authClose) authClose.addEventListener('click', function(e){ e.preventDefault(); closeAuthModal(); });

        // tab switches
        const tabLogin = document.getElementById('tab-login');
        const tabRegister = document.getElementById('tab-register');
        if (tabLogin) tabLogin.addEventListener('click', function(){ openAuthModal('login'); });
        if (tabRegister) tabRegister.addEventListener('click', function(){ openAuthModal('register'); });

        // forms
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        if (registerForm) registerForm.addEventListener('submit', handleRegister);

        // initial display
        showUserState();

        // click outside modal to close
        const modal = document.getElementById('auth-modal');
        if (modal) modal.addEventListener('click', function(e){ if (e.target === modal) closeAuthModal(); });

        // expose a function to open profile inside the same modal
        window.openProfileModal = function(){
            const cur = getCurrentUser();
            if (!authFormsContainer) return;
            // build profile view
            const profileHtml = `
                <div style="text-align:center; padding:10px 6px;">
                    ${cur && cur.picture ? `<img src="${escapeHtml(cur.picture)}" alt="avatar" style="width:96px;height:96px;border-radius:50%;object-fit:cover;margin-bottom:12px;">` : ''}
                    <h3 style="margin-bottom:6px;">${escapeHtml(cur.name || cur.username || '')}</h3>
                    <p style="color:#666;margin-bottom:6px;">${escapeHtml(cur.email || '')}</p>
                    <div style="margin-top:12px;display:flex;gap:8px;justify-content:center;">
                        <button class="btn" id="profile-logout">Cerrar sesión</button>
                        <button class="btn btn-secondary" id="profile-close">Cerrar</button>
                    </div>
                </div>
            `;
            authFormsContainer.innerHTML = profileHtml;
            openAuthModal('profile');
            // attach handlers
            const logoutBtn = document.getElementById('profile-logout');
            const closeBtn = document.getElementById('profile-close');
            if (logoutBtn) logoutBtn.addEventListener('click', function(e){ e.preventDefault(); logout(); closeAuthModal(); /* restore forms */ if (authFormsContainer) authFormsContainer.innerHTML = ORIGINAL_AUTH_FORMS; attachAuthListeners(); initGoogleSignIn(); });
            if (closeBtn) closeBtn.addEventListener('click', function(e){ e.preventDefault(); closeAuthModal(); if (authFormsContainer) authFormsContainer.innerHTML = ORIGINAL_AUTH_FORMS; attachAuthListeners(); initGoogleSignIn(); });
        };
    })();

    /* ---------------- Google Sign-In Integration ---------------- */
    const GOOGLE_CLIENT_ID = 'REPLACE_WITH_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

    function decodeJwtResponse(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }

    function handleGoogleCredential(response) {
        const payload = decodeJwtResponse(response.credential);
        if (!payload) { console.warn('No se pudo decodificar el token de Google.'); return; }
        // payload contains: sub, name, given_name, family_name, picture, email, email_verified, locale
        const user = {
            username: payload.email || payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture
        };
        setCurrentUser(user);
        closeAuthModal();
        showUserState();
    }

    function initGoogleSignIn() {
        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.indexOf('REPLACE_WITH_GOOGLE_CLIENT_ID') !== -1) {
            console.info('Google Client ID no configurado. Ignorando inicialización de Google Sign-In.');
            return;
        }

        const tryInit = function() {
            if (window.google && google.accounts && google.accounts.id) {
                google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleCredential });
                const container = document.getElementById('google-signin-button');
                if (container) {
                    google.accounts.id.renderButton(container, { theme: 'outline', size: 'large' });
                    // opcion: mostrar prompt
                    // google.accounts.id.prompt();
                }
                return true;
            }
            return false;
        };

        // try immediately, otherwise poll until the SDK loads (max 5s)
        if (!tryInit()) {
            const start = Date.now();
            const iv = setInterval(function() {
                if (tryInit() || (Date.now() - start) > 5000) clearInterval(iv);
            }, 200);
        }
    }

    // start Google init (will no-op if client id not set)
    initGoogleSignIn();
});