import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { groupID, userId } = await request.json();
    const client = await clientPromise;
    const db = client.db("timeCapsuleDB");

    // Update the group document by adding the user to members array
    const result = await db.collection('groups').updateOne(
      { _id: new ObjectId(groupID) },
      { $addToSet: { members: userId } }  // $addToSet ensures no duplicates
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Group not found or user already added' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sharing group:', error);
    return NextResponse.json({ error: 'Failed to share group' }, { status: 500 });
  }
} 