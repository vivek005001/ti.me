import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { auth } from '@clerk/nextjs/server';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { groupId } = params;
    if (!groupId) {
      return NextResponse.json({ success: false, error: 'Group ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("timeCapsuleDB");

    // Get all capsules that belong to this group
    const capsules = await db.collection("timeCapsules")
      .find({
        groupId: groupId, // Exact match for groupId
        type: 'group',    // Only get group capsules
        endTime: { $gt: new Date() } // Only get capsules that haven't ended
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      capsules: capsules
    });
    
  } catch (error) {
    console.error('Error fetching group capsules:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch group capsules' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { groupId, ...capsuleData } = body;

    const client = await clientPromise;
    const db = client.db("timeCapsuleDB");

    // Validate required fields
    if (!groupId || !capsuleData.caption || !capsuleData.endTime) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the capsule document
    const capsule = {
      ...capsuleData,
      groupId,
      createdAt: new Date(),
      type: 'group',
      createdBy: userId,
      files: capsuleData.files || [],
      isLocked: false,
      isOpened: false
    };

    const result = await db.collection("timeCapsules").insertOne(capsule);

    return NextResponse.json({
      success: true,
      capsule: { ...capsule, _id: result.insertedId },
    });
  } catch (error) {
    console.error('Failed to create group capsule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create group capsule' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { groupId, _id, ...updateData } = body;

    const client = await clientPromise;
    const db = client.db("timeCapsuleDB");
    
    // Validate required fields
    if (!groupId || !_id) {
      return NextResponse.json(
        { success: false, error: 'Group ID and Capsule ID are required' },
        { status: 400 }
      );
    }

    // Update the capsule
    const result = await db.collection("timeCapsules").updateOne(
      { 
        _id: new ObjectId(_id),
        groupId: groupId, // Ensure the capsule belongs to this group
        type: 'group'     // Additional check to ensure it's a group capsule
      },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date(),
          updatedBy: userId
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Capsule not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Capsule updated successfully'
    });
  } catch (error) {
    console.error('Failed to update group capsule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update group capsule' },
      { status: 500 }
    );
  }
} 