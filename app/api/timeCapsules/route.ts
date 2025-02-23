import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { TimeCapsuleData } from '@/app/types';
import { auth } from '@clerk/nextjs/server';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("timeCapsuleDB");
    
    const data = await request.json();
    
    // Add validation if needed
    if (!data.description || !data.caption || !data.endTime) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const capsuleWithUser = {
      ...data,
      userId,
      groupId: null, // Explicitly set groupId to null for personal capsules
      _id: new ObjectId(),
      createdAt: new Date().toISOString()
    };


    const result = await db.collection("timeCapsules").insertOne(capsuleWithUser);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId 
    });
  } catch (error) {
    console.error('Error creating time capsule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create time capsule' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("timeCapsuleDB");

    // Get IDs of capsules shared with this user
    const sharedCapsuleIds = (await db.collection("capsuleShares")
      .find({ sharedWithUserId: userId })
      .toArray())
      .map(share => new ObjectId(share.capsuleId));

    // Fetch both owned and shared capsules, but only personal ones (groupId: null)
    const capsules = await db.collection("timeCapsules")
      .find({
        $and: [
          {
            $or: [
              { userId },
              { _id: { $in: sharedCapsuleIds } }
            ]
          },
          { groupId: null } // Only get personal capsules
        ]
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ capsules });
  } catch (error) {
    console.error('Error fetching time capsules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time capsules' },
      { status: 500 }
    );
  }
} 