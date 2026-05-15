import { NextResponse } from 'next/server';
import sql, { initDB, SERVICE_SEED } from '@/lib/db';

const fallbackServices = SERVICE_SEED.map((service, index) => ({
  id: index + 1,
  name: service.name,
  description: service.description,
  price: service.price
}));

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initDB();
    const services = await sql`SELECT * FROM services`;
    if (!Array.isArray(services) || services.length === 0) {
      return NextResponse.json(fallbackServices);
    }
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services, usando catálogo fallback:', error);
    return NextResponse.json(fallbackServices);
  }
}
