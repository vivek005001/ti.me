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

    const { name, description, isPrivate } = await request.json();
    
    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("timeCapsuleDB");
    
    const group = {
      _id: new ObjectId(),
      name,
      description,
      createdBy: userId,
      members: [userId],
      createdAt: new Date().toISOString(),
      isPrivate: isPrivate || false,
    };

    await db.collection("groups").insertOne(group);

    return NextResponse.json({ 
      success: true,
      group
    });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create group' },
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

    // Fetch groups that are either public or belong to the user
    const groups = await db.collection("groups")
      .find({
        $or: [
          { isPrivate: false }, // Public groups
          { members: userId }   // Groups the user is a member of
        ]
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ groups });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    );
  }
} 