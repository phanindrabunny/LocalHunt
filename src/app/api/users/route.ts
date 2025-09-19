import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { db } = await connectToDatabase();
    // Ensure minimal shape
    const user = {
      name: data.name || '',
      email: data.email,
      role: data.role || 'user',
      joinedDate: data.joinedDate || new Date().toISOString().split('T')[0],
    };
    const result = await db.collection('users').insertOne({ ...user, _id: data.id || undefined });
    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error) {
    console.error('POST /api/users error', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const users = await db.collection('users').find({}).toArray();
    return NextResponse.json(users);
  } catch (error) {
    console.error('GET /api/users error', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
