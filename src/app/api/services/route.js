import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const services = db.prepare('SELECT * FROM services').all();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching services' }, { status: 500 });
  }
}
