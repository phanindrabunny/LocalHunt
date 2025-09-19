import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase();
    const id = params.id;
    // Try to find by _id first, fall back to matching by uid field
    let user = null;
    try {
      user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    } catch (err) {
      // ignore invalid ObjectId
    }

    if (!user) {
      user = await db.collection('users').findOne({ uid: id });
    }

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    console.error('GET /api/users/[id] error', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
