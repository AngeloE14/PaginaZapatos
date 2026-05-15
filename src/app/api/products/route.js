import { NextResponse } from 'next/server';
import sql, { initDB, PRODUCT_SEED } from '@/lib/db';

const fallbackProducts = PRODUCT_SEED.map((product, index) => ({
  id: index + 1,
  name: product.name,
  price: product.price,
  image: product.image,
  description: product.description,
  sizes: product.sizes.split(',').map((size) => parseInt(size.trim(), 10))
}));

function formatProducts(products) {
  return products.map((product) => ({
    ...product,
    sizes: Array.isArray(product.sizes)
      ? product.sizes
      : String(product.sizes)
          .split(',')
          .map((size) => parseInt(size.trim(), 10))
  }));
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initDB();

    const products = await sql`SELECT * FROM products`;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(fallbackProducts);
    }

    return NextResponse.json(formatProducts(products));
  } catch (error) {
    console.error('Error fetching products, usando catálogo fallback:', error);
    return NextResponse.json(fallbackProducts);
  }
}
