import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("timeCapsuleDB");
    
    // Get capsules that haven't reached their endTime yet
    const capsules = await db.collection("timeCapsules")
      .find({
        userId,
        endTime: { $gt: new Date().toISOString() }
      })
      .sort({ endTime: 1 })
      .toArray();

    return NextResponse.json({ 
      success: true,
      capsules 
    });
  } catch (error) {
    console.error('Error fetching upcoming capsules:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch upcoming capsules' },
      { status: 500 }
    );
  }
} 