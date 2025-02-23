import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { auth } from '@clerk/nextjs/server';

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

    const now = new Date().toISOString();
    const capsules = await db.collection("timeCapsules")
      .find({
        groupId: groupId,
        endTime: { $gt: now } // Only get capsules that haven't ended yet
      })
      .sort({ endTime: 1 }) // Sort by end time, soonest first
      .toArray();

    return NextResponse.json({
      success: true,
      capsules: capsules
    });
    
  } catch (error) {
    console.error('Error fetching upcoming group capsules:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch upcoming group capsules' },
      { status: 500 }
    );
  }
} 