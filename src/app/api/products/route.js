// Force reload
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const products = db.prepare('SELECT * FROM products').all();
    
    // Transform sizes from string to array
    const formattedProducts = products.map(product => ({
      ...product,
      sizes: product.sizes.split(',').map(s => parseInt(s.trim()))
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}
