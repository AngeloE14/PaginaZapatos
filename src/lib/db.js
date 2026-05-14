import Database from 'better-sqlite3';
import path from 'path';

const hasRemoteDatabase = Boolean(process.env.DATABASE_URL);

let cachedNeonClient = null;
let sqliteClient = null;
let initInProgress = null;
let initCompleted = false;

async function getNeonClient() {
  if (!hasRemoteDatabase) return null;
  if (cachedNeonClient) return cachedNeonClient;

  try {
    const { neon } = await import('@neondatabase/serverless');
    cachedNeonClient = neon(process.env.DATABASE_URL);
    return cachedNeonClient;
  } catch (error) {
    console.warn('No se pudo cargar Neon, se usará SQLite local:', error.message);
    return null;
  }
}

function getSqliteClient() {
  if (!sqliteClient) {
    const sqlitePath = path.join(process.cwd(), 'database.sqlite');
    sqliteClient = new Database(sqlitePath);
  }
  return sqliteClient;
}

function buildSqliteQuery(strings, values) {
  let text = '';

  for (let i = 0; i < strings.length; i += 1) {
    text += strings[i];
    if (i < values.length) text += '?';
  }

  return { text, values };
}

function isReadOnlyQuery(query) {
  return /^\s*(SELECT|PRAGMA|WITH)\b/i.test(query);
}

export async function sql(strings, ...values) {
  const neonClient = await getNeonClient();
  if (neonClient) {
    return neonClient(strings, ...values);
  }

  const db = getSqliteClient();
  const { text, values: params } = buildSqliteQuery(strings, values);
  const statement = db.prepare(text);

  if (isReadOnlyQuery(text)) {
    return statement.all(...params);
  }

  statement.run(...params);
  return [];
}

export async function initDB() {
  if (initCompleted) return;
  if (initInProgress) {
    await initInProgress;
    return;
  }

  initInProgress = (async () => {
    const usingNeon = Boolean(await getNeonClient());

    if (usingNeon) {
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          price REAL NOT NULL,
          image TEXT NOT NULL,
          description TEXT,
          sizes TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS services (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          password TEXT NOT NULL,
          is_verified INTEGER DEFAULT 0,
          verification_token TEXT
        )
      `;
    } else {
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          price REAL NOT NULL,
          image TEXT NOT NULL,
          description TEXT,
          sizes TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS services (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          password TEXT NOT NULL,
          is_verified INTEGER DEFAULT 0,
          verification_token TEXT
        )
      `;
    }

    const counts = await sql`SELECT COUNT(*) as count FROM products`;
    const totalProducts = Number(counts?.[0]?.count ?? 0);

    if (totalProducts === 0) {
      const productsToSeed = [
        { name: 'Royal Gold Edition', price: 149.99, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&w=800&q=80', desc: 'Edición especial en blanco con detalles dorados premium.', sizes: '7,8,9,10,11' },
        { name: 'Classic Pure White', price: 99.99, image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&w=800&q=80', desc: 'El blanco clásico impecable para cualquier ocasión.', sizes: '6,7,8,9,10' },
        { name: 'Onyx Black & Gold', price: 129.99, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&w=800&q=80', desc: 'Zapatillas en negro obsidiana con logotipo y acabados dorados.', sizes: '8,9,10,11,12' },
        { name: 'Champagne Runners', price: 119.99, image: 'https://images.unsplash.com/photo-1551107696-a4b0a5f5d95c?ixlib=rb-4.0.3&w=800&q=80', desc: 'Zapatillas deportivas color champagne, ultraligeras.', sizes: '6,7,8,9' },
        { name: 'Platinum Silver', price: 139.99, image: 'https://images.unsplash.com/photo-1552346154-21d32810baa3?ixlib=rb-4.0.3&w=800&q=80', desc: 'Detalles platinados para resaltar en cada paso.', sizes: '7,8,9,10,11' },
        { name: 'Rose Gold Comfort', price: 109.99, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&w=800&q=80', desc: 'Zapatillas urbanas color rosa pálido y detalles en oro rosado.', sizes: '5,6,7,8,9' },
        { name: 'Midnight Blue & Gold', price: 134.99, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&w=800&q=80', desc: 'Azul medianoche profundo para máxima elegancia nocturna.', sizes: '8,9,10,11' },
        { name: 'Leather Heritage', price: 159.99, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&w=800&q=80', desc: 'Cuero genuino hecho a mano con costuras premium.', sizes: '9,10,11,12' },
        { name: 'Golden Mids', price: 114.99, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&w=800&q=80', desc: 'Silueta de media bota con estética retro moderna.', sizes: '7,8,9,10' },
        { name: 'Diamond White Low', price: 95.99, image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?ixlib=rb-4.0.3&w=800&q=80', desc: 'Zapatillas de perfil bajo color diamante puro.', sizes: '6,7,8,9,10,11' },
        { name: 'Street Prestige', price: 144.99, image: 'https://images.unsplash.com/photo-1584735174965-48c48d7028a9?ixlib=rb-4.0.3&w=800&q=80', desc: 'Diseño audaz con plataforma y suela translúcida.', sizes: '7,8,9,10' },
        { name: 'Velvet Gold High', price: 179.99, image: 'https://images.unsplash.com/photo-1534653299134-96a171b61581?ixlib=rb-4.0.3&w=800&q=80', desc: 'Botines de terciopelo premium con broches de oro.', sizes: '8,9,10,11,12' }
      ];

      for (const prod of productsToSeed) {
        await sql`INSERT INTO products (name, price, image, description, sizes) VALUES (${prod.name}, ${prod.price}, ${prod.image}, ${prod.desc}, ${prod.sizes})`;
      }

      await sql`
        INSERT INTO services (name, description, price) VALUES 
        ('Cambio de suela', 'Reemplazo completo de la suela desgastada', 25.00),
        ('Reparación de costuras', 'Arreglo de costuras rotas o desgastadas', 15.00),
        ('Reemplazo de cordones', 'Cambio de cordones por unos nuevos', 8.00),
        ('Limpieza profunda', 'Limpieza completa y restauración de color', 12.00),
        ('Reparación de cremallera', 'Arreglo o reemplazo de cremallera dañada', 18.00),
        ('Refuerzo de talón', 'Refuerzo interno para mayor durabilidad', 10.00)
      `;
    }
  })();

  try {
    await initInProgress;
    initCompleted = true;
  } finally {
    initInProgress = null;
  }
}

export default sql;
