import clientPromise from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { groupID, userId } = await request.json();
    console.log('Received request:', { groupID, userId });

    const client = await clientPromise;
    const db = client.db("timecapsules");

    // Find group using groupID directly instead of converting to ObjectId
    const group = await db.collection('groups').findOne({
      groupID: groupID  // Use groupID string directly
    });
    console.log('Found group:', group);

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Update using groupID
    const result = await db.collection('groups').updateOne(
      { groupID: groupID },  // Use groupID string directly
      { $addToSet: { members: userId } }
    );
    console.log('Update result:', result);

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'User already added' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Failed to share group' }, { status: 500 });
  }
} 