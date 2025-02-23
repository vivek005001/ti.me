import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const { groupId, description, caption, files, endTime, userId, location } = await req.json();
    

    if (!groupId) {
      return NextResponse.json({ success: false, error: 'Group ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const capsules = db.collection('capsules');

    const result = await capsules.insertOne({
      groupId,
      description,
      caption,
      files,
      endTime,
      userId,
      location,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      capsule: result 
    });

  } catch (error) {
    console.error('Error creating capsule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create capsule' },
      { status: 500 }
    );
  }
}

// Add GET endpoint to fetch capsules
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get('groupId');

    if (!groupId) {
      return NextResponse.json({ success: false, error: 'Group ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const capsules = db.collection('capsules');

    const results = await capsules.find({ groupId }).toArray();

    return NextResponse.json({ 
      success: true, 
      capsules: results 
    });

  } catch (error) {
    console.error('Error fetching capsules:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch capsules' },
      { status: 500 }
    );
  }
} 