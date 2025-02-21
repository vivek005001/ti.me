import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { TimeCapsuleData } from '@/app/types';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("timeCapsuleDB");
    
    const data: TimeCapsuleData = await request.json();
    
    // Add validation if needed
    if (!data.description || !data.caption || !data.endTime) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await db.collection("timeCapsules").insertOne(data);
    
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
    const client = await clientPromise;
    const db = client.db("timeCapsuleDB");
    
    const timeCapsules = await db.collection("timeCapsules")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ 
      success: true, 
      data: timeCapsules 
    });
  } catch (error) {
    console.error('Error fetching time capsules:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch time capsules' },
      { status: 500 }
    );
  }
} 