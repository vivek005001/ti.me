import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { auth } from '@clerk/nextjs/server';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { capsuleId, targetUserId } = await request.json();
    
    if (!capsuleId || !targetUserId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("timeCapsuleDB");
    
    // Convert string ID to ObjectId
    const objectId = new ObjectId(capsuleId);
    
    // Verify the capsule exists and belongs to the current user
    const capsule = await db.collection("timeCapsules").findOne({
      _id: objectId,
      userId
    });

    if (!capsule) {
      return NextResponse.json(
        { success: false, error: 'Capsule not found or unauthorized' },
        { status: 404 }
      );
    }

    // Add share access
    await db.collection("capsuleShares").insertOne({
      capsuleId: objectId,
      sharedByUserId: userId,
      sharedWithUserId: targetUserId,
      sharedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sharing time capsule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to share time capsule' },
      { status: 500 }
    );
  }
} 