import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("timeCapsuleDB");
    const capsule = await db
      .collection('timeCapsules')
      .findOne({ _id: new ObjectId(params.id) });

    if (!capsule) {
      return NextResponse.json({ error: 'Capsule not found' }, { status: 404 });
    }

    return NextResponse.json({ capsule });
  } catch (error) {
    console.error('Failed to fetch capsule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 