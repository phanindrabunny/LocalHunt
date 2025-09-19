import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const vendors = await db.collection('vendors').find({}).toArray();
    return NextResponse.json(vendors);
  } catch (error) {
    console.error('GET /api/vendors error', error);
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { db } = await connectToDatabase();
    const result = await db.collection('vendors').insertOne(data);
    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error) {
    console.error('POST /api/vendors error', error);
    return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 });
  }
}
