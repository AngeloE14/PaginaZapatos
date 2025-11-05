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
        // cargar carrito desde localStorage para persistencia
        if (typeof loadCart === 'function') loadCart();
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

    // Realiza la búsqueda filtrando por nombre y descripción (case-insensitive)
    function performProductSearch(query) {
        const productsGrid = document.querySelector('.products-grid');
        productsGrid.innerHTML = '';
        if (!query) {
            loadProducts();
            return;
        }

        const matched = products.filter(p => {
            return (p.name && p.name.toLowerCase().includes(query)) || (p.description && p.description.toLowerCase().includes(query));
        });

        if (matched.length === 0) {
            productsGrid.innerHTML = `<div class="no-results"><p>No se encontraron productos para "${escapeHtml(query)}".</p><p><a href="#" class="nav-link" data-tab="products">Ver todos los productos</a></p></div>`;
            // attach nav-link handler already exists globally; ensure products tab is shown
            showTab('products');
            return;
        }

        matched.forEach(product => {
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
        showTab('products');
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
        // Carrito: delegación para eliminar y ajustar cantidades
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-item')) {
                const cartId = e.target.getAttribute('data-cart-id');
                removeFromCart(cartId);
            }
            if (e.target.classList.contains('cart-decrease')) {
                const cartId = e.target.getAttribute('data-cart-id');
                changeCartQuantity(cartId, -1);
            }
            if (e.target.classList.contains('cart-increase')) {
                const cartId = e.target.getAttribute('data-cart-id');
                changeCartQuantity(cartId, 1);
            }
        });

        // input para cambiar cantidad directamente
        document.addEventListener('input', function(e) {
            if (e.target.classList && e.target.classList.contains('cart-quantity-input')) {
                const cartId = e.target.getAttribute('data-cart-id');
                const val = parseInt(e.target.value) || 1;
                setCartQuantity(cartId, val);
            }
        });

            // Checkout button: requiere sesión
            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) checkoutBtn.addEventListener('click', function(e){
                e.preventDefault();
                if (!getCurrentUser()) {
                    openAuthModal('login');
                    return;
                }
                // Simulación de proceder al pago
                alert('Procediendo al pago... (demo)');
            });

        // Búsqueda en header: toggle, submit y clear
        const searchToggle = document.getElementById('search-toggle');
        const headerSearch = document.getElementById('header-search');
        const searchForm = document.getElementById('search-form');
        const searchInput = document.getElementById('search-input');
        const searchClear = document.getElementById('search-clear');

        if (searchToggle) searchToggle.addEventListener('click', function(e){
            e.preventDefault();
            if (headerSearch) headerSearch.classList.toggle('active');
            // focus rápido al abrir
            setTimeout(() => { if (searchInput) searchInput.focus(); }, 50);
        });

        if (searchForm) searchForm.addEventListener('submit', function(e){
            e.preventDefault();
            const q = (searchInput && searchInput.value || '').trim().toLowerCase();
            performProductSearch(q);
        });

        if (searchClear) searchClear.addEventListener('click', function(e){
            e.preventDefault();
            if (searchInput) searchInput.value = '';
            // restaurar lista completa
            loadProducts();
            if (headerSearch) headerSearch.classList.remove('active');
            showTab('products');
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
        // Requerir sesión para añadir al carrito
        const cur = getCurrentUser();
        if (!cur) {
            openAuthModal('login');
            return;
        }

        const selectedSize = document.querySelector('.size-option.selected');
        const quantity = parseInt(document.querySelector('.quantity-input').value);

        if (!selectedSize) {
            alert('Por favor, selecciona una talla.');
            return;
        }

        const size = selectedSize.getAttribute('data-size');
        
        // Comprobar si ya existe el mismo producto+size en el carrito -> sumar cantidades
        const existingIndex = cart.findIndex(ci => ci.id === currentProduct.id && String(ci.size) === String(size));
        if (existingIndex !== -1) {
            cart[existingIndex].quantity = (parseInt(cart[existingIndex].quantity) || 0) + quantity;
        } else {
            // Añadir item con id único de carrito (cartItemId)
            const cartItemId = Date.now().toString(36) + Math.random().toString(36).slice(2,8);
            cart.push({
                cartItemId,
                id: currentProduct.id,
                name: currentProduct.name,
                price: currentProduct.price,
                quantity: quantity,
                size: size,
                image: currentProduct.image
            });
        }

        // Persistir carrito y actualizar la vista
        if (typeof saveCart === 'function') saveCart();

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
        const cartSummary = document.getElementById('cart-summary');

        // Si el carrito está vacío, mostrar mensaje predeterminado (reconstruir si fue removido)
        if (!cart || cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message" id="empty-cart-message">
                    <p>Tu carrito está vacío. <a href="#" class="nav-link" data-tab="products">¡Agrega algunos productos!</a></p>
                </div>
            `;
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }

        // Hay items: limpiar y renderizar
        cartItemsContainer.innerHTML = '';
        if (cartSummary) cartSummary.style.display = 'block';

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
                        <button class="btn cart-decrease" data-cart-id="${item.cartItemId}">-</button>
                        <input class="cart-quantity-input" data-cart-id="${item.cartItemId}" type="number" value="${item.quantity}" min="1" style="width:60px;text-align:center;margin:0 8px;" />
                        <button class="btn cart-increase" data-cart-id="${item.cartItemId}">+</button>
                        <span class="cart-item-remove remove-item" data-cart-id="${item.cartItemId}" style="margin-left:12px;cursor:pointer;color:var(--secondary);">Quitar del carrito</span>
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

        // Añadir botón para vaciar carrito si no existe
        let emptyBtn = document.getElementById('empty-cart-btn');
        if (!emptyBtn && cartSummary) {
            emptyBtn = document.createElement('button');
            emptyBtn.id = 'empty-cart-btn';
            emptyBtn.className = 'btn btn-secondary';
            emptyBtn.textContent = 'Vaciar carrito';
            emptyBtn.style.marginLeft = '10px';
            // Insert before the checkout link if present
            cartSummary.appendChild(emptyBtn);
            emptyBtn.addEventListener('click', function(){ cart = []; saveCart(); updateCartView(); });
        }
    }

    // Ahora removeFromCart recibe el cartItemId único y remueve el item correcto
    function removeFromCart(cartItemId) {
        if (!cartItemId) return;
        cart = cart.filter(item => item.cartItemId !== cartItemId);
        if (typeof saveCart === 'function') saveCart();
        updateCartView();
    }

    // Cambiar cantidad por delta (+1 / -1)
    function changeCartQuantity(cartItemId, delta) {
        const idx = cart.findIndex(i => i.cartItemId === cartItemId);
        if (idx === -1) return;
        const newQty = (parseInt(cart[idx].quantity) || 0) + delta;
        if (newQty < 1) return; // no permitir 0 aquí
        cart[idx].quantity = newQty;
        if (typeof saveCart === 'function') saveCart();
        updateCartView();
    }

    function setCartQuantity(cartItemId, qty) {
        const idx = cart.findIndex(i => i.cartItemId === cartItemId);
        if (idx === -1) return;
        const newQty = Math.max(1, parseInt(qty) || 1);
        cart[idx].quantity = newQty;
        if (typeof saveCart === 'function') saveCart();
        updateCartView();
    }

    /* ---------------------- Authentication (client-side) ---------------------- */
    const USERS_KEY = 'mz_users_v1';
    const CART_KEY = 'mz_cart_v1';
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
        // Al iniciar sesión, cargar el carrito asociado a este usuario
        try { loadCart(); } catch (e) { /* ignore */ }
    }

    function clearCurrentUser() {
        localStorage.removeItem(CURRENT_USER_KEY);
        // Al cerrar sesión, cargar el carrito de invitado (o vacío)
        try { loadCart(); } catch (e) { cart = []; }
    }

    // Cart persistence helpers
    function getCartKey() {
        const cur = getCurrentUser();
        if (cur && (cur.username || cur.email)) {
            const id = cur.username || cur.email;
            return `${CART_KEY}_${id}`;
        }
        return `${CART_KEY}_guest`;
    }

    function saveCart() {
        try {
            const key = getCartKey();
            localStorage.setItem(key, JSON.stringify(cart || []));
        } catch(e) { console.warn('No se pudo guardar el carrito', e); }
    }

    function loadCart() {
        try {
            const key = getCartKey();
            cart = JSON.parse(localStorage.getItem(key)) || [];
        } catch(e) { cart = []; }
        try { updateCartView(); } catch(e) {}
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

    // Registro con fecha de nacimiento, país y CURP
    function handleRegister(e) {
        e.preventDefault();
        const u = document.getElementById('reg-username').value.trim();
        const p = document.getElementById('reg-password').value;
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const phone = document.getElementById('reg-phone').value.trim();
        const birth = document.getElementById('reg-birth').value;
        const country = document.getElementById('reg-country').value.trim();
        const curp = document.getElementById('reg-curp').value.trim();
        const err = document.getElementById('reg-error');

        // Validaciones específicas
        // Usuario y contraseña obligatorios
        if (!u || !p || !name || !email || !birth || !country || !curp) {
            err.textContent = 'Completa todos los campos obligatorios.';
            return;
        }
        // Email válido
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            err.textContent = 'Correo electrónico inválido.';
            return;
        }
        // Teléfono: opcional, pero si se ingresa debe ser numérico y de 10 dígitos
        if (phone && !/^\d{10}$/.test(phone)) {
            err.textContent = 'El teléfono debe tener 10 dígitos.';
            return;
        }
        // CURP: 18 caracteres, letras y números
        if (!/^([A-Z]{4})(\d{6})([HM])([A-Z]{5})([A-Z\d]{2})$/.test(curp)) {
            err.textContent = 'CURP inválido. Debe tener 18 caracteres y formato oficial.';
            return;
        }
        // País: solo letras y espacios
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(country)) {
            err.textContent = 'El país solo debe contener letras y espacios.';
            return;
        }
        // Fecha de nacimiento: debe ser pasada y mayor de 13 años
        const birthDate = new Date(birth);
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
        if (birthDate > today) {
            err.textContent = 'La fecha de nacimiento debe ser en el pasado.';
            return;
        }
        if (birthDate > minDate) {
            err.textContent = 'Debes tener al menos 13 años.';
            return;
        }
        let users = getUsers();
        if (users.find(x => x.username === u)) {
            err.textContent = 'El usuario ya existe.';
            return;
        }
        // Guardar todos los datos del usuario
        users.push({ username: u, password: p, name, email, phone, birth, country, curp });
        saveUsers(users);
        // Guardar usuario actual con todos los datos
        setCurrentUser({ username: u, name, email, phone, birth, country, curp });
        closeAuthModal();
        showUserState();
    }

    // Login: carga todos los datos del usuario registrado
    function handleLogin(e) {
        e.preventDefault();
        // Ahora el login se realiza con correo electrónico + contraseña
        const email = document.getElementById('auth-email').value.trim();
        const p = document.getElementById('auth-password').value;
        const err = document.getElementById('auth-error');

        if (!email || !p) {
            err.textContent = 'Completa correo y contraseña.';
            return;
        }
        const users = getUsers();
        // Buscar por email en lugar de por username
        const found = users.find(x => x.email === email && x.password === p);
        if (found) {
            // Guardar todos los datos del usuario en sesión
            setCurrentUser({ username: found.username, name: found.name, email: found.email, phone: found.phone, birth: found.birth, country: found.country, curp: found.curp });
            closeAuthModal();
            showUserState();
        } else {
            err.textContent = 'Correo o contraseña incorrectos.';
        }
    }

    // Mostrar todos los datos del usuario en el header y en el modal de perfil
    function showUserState() {
        const userBtn = document.getElementById('user-button');
        const current = getCurrentUser();
        if (!userBtn) return;

        if (current && (current.username || current.name || current.email)) {
            // Mostrar nombre y usuario en el header
            userBtn.innerHTML = `<button class="user-badge" id="user-badge-button" style="border:none;background:transparent;cursor:pointer;display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:20px;">
                <span style="font-weight:600;color:var(--primary);">${escapeHtml(current.name || current.username)}</span>
                <span style="font-size:0.9em;color:#666;">(${escapeHtml(current.username)})</span>
            </button>`;
            // clicking the badge opens the profile modal
            const badge = document.getElementById('user-badge-button');
            if (badge) badge.addEventListener('click', function(e){ e.preventDefault(); openProfileModal(); });
        } else {
            userBtn.innerHTML = '<i class="fas fa-user"></i>';
        }
    }

    // Modal de perfil: muestra todos los datos del usuario
    window.openProfileModal = function(){
        const cur = getCurrentUser();
        const authFormsContainer = document.querySelector('.auth-forms');
        const ORIGINAL_AUTH_FORMS = authFormsContainer ? authFormsContainer.innerHTML : '';
        if (!authFormsContainer) return;
        // Construir vista de perfil con nombre, usuario y correo (correo editable)
        const profileHtml = `
            <div style="text-align:center; padding:10px 6px;">
                <h3 style="margin-bottom:6px;">${escapeHtml(cur.name || cur.username || '')}</h3>
                <p style="color:#666;margin-bottom:6px;">Usuario: <b>${escapeHtml(cur.username || '')}</b></p>
                <div style='margin-bottom:6px;'>
                    <label for='profile-email' style='font-weight:500;color:#666;'>Correo:</label><br>
                    <input id='profile-email' type='email' class='form-control' style='width:80%;margin:6px auto;' value='${escapeHtml(cur.email || '')}' />
                </div>
                <div style="margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                    <button class="btn" id="profile-save-email">Guardar correo</button>
                    <button class="btn" id="profile-logout">Cerrar sesión</button>
                    <button class="btn btn-secondary" id="profile-close">Cerrar</button>
                </div>
                <div id='profile-email-msg' style='margin-top:8px;color:var(--secondary);font-weight:600;'></div>
            </div>
        `;
        authFormsContainer.innerHTML = profileHtml;
        openAuthModal('profile');
        // Guardar correo editado
        const saveBtn = document.getElementById('profile-save-email');
        if (saveBtn) saveBtn.addEventListener('click', function(e){
            e.preventDefault();
            const emailInput = document.getElementById('profile-email');
            const msg = document.getElementById('profile-email-msg');
            const newEmail = emailInput.value.trim();
            if (!/^\S+@\S+\.\S+$/.test(newEmail)) {
                msg.textContent = 'Correo electrónico inválido.';
                return;
            }
            // Actualizar en localStorage y sesión
            let users = getUsers();
            let idx = users.findIndex(x => x.username === cur.username);
            if (idx !== -1) {
                users[idx].email = newEmail;
                saveUsers(users);
            }
            setCurrentUser({ ...cur, email: newEmail });
            msg.textContent = 'Correo actualizado correctamente.';
            showUserState();
        });
        // Cerrar sesión y cerrar modal
        const logoutBtn = document.getElementById('profile-logout');
        const closeBtn = document.getElementById('profile-close');
        if (logoutBtn) logoutBtn.addEventListener('click', function(e){ e.preventDefault(); logout(); closeAuthModal(); if (authFormsContainer) authFormsContainer.innerHTML = ORIGINAL_AUTH_FORMS; attachAuthListeners(); });
        if (closeBtn) closeBtn.addEventListener('click', function(e){ e.preventDefault(); closeAuthModal(); if (authFormsContainer) authFormsContainer.innerHTML = ORIGINAL_AUTH_FORMS; attachAuthListeners(); });
    }

    function escapeHtml(text){
        return String(text).replace(/[&<>"]/g, function(s){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[s]; });
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