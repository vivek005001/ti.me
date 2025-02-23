import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('timecapsules');
    
    const body = await request.json();
    const { name, description, isPrivate } = body;
    
    const group = {
      groupID: uuidv4(),  // Add a unique groupID using UUID
      name,
      description,
      isPrivate,
      createdBy: userId,
      members: [userId],  // Initialize with the creator as the first member
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('groups').insertOne(group);
    
    // Get the inserted document with both MongoDB _id and our groupID
    const insertedGroup = {
      _id: result.insertedId,
      ...group
    };
    
    await client.close();
    
    return NextResponse.json(insertedGroup, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json(
      { error: 'Failed to create group' },
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

    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('timecapsules');
    
    const groups = await db.collection('groups')
      .find({
        $or: [
          { isPrivate: false },
          { members: userId }
        ]
      })
      .toArray();
    
    await client.close();
    
    return NextResponse.json({ groups });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    );
  }
} 