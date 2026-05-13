const db = require('better-sqlite3')('database.sqlite');
db.exec("INSERT INTO products (name, price, image, description, sizes) VALUES ('Zapatillas de Prueba (0 Pesos)', 0.00, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&w=800&q=80', 'Artículo de prueba sin costo para verificar el flujo de compra, correo electrónico de confirmación y formulario de pago.', '7,8,9')");
console.log('Producto agregado exitosamente.');
