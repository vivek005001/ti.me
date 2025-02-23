import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { groupID, userId } = await request.json();
    console.log('Received request:', { groupID, userId });  // Log received data

    const client = await clientPromise;
    const db = client.db("timecapsules");

    // First try to find the group
    const group = await db.collection('groups').findOne({
      _id: new ObjectId(groupID)
    });
    console.log('Found group:', group);  // Log found group

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Then try to update it
    const result = await db.collection('groups').updateOne(
      { _id: new ObjectId(groupID) },
      { $addToSet: { members: userId } }
    );
    console.log('Update result:', result);  // Log update result

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'User already added' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);  // Log detailed error
    return NextResponse.json({ error: 'Failed to share group' }, { status: 500 });
  }
} 