import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import { auth } from '@clerk/nextjs/server';

export async function POST(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("timeCapsuleDB");

    const result = await db.collection('groups').updateOne(
      { _id: new ObjectId(params.groupId) },
      { $addToSet: { members: userId } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Group not found or user already added' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error joining group:', error);
    return NextResponse.json({ error: 'Failed to join group' }, { status: 500 });
  }
} 