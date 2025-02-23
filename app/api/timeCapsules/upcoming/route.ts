'use client';
import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { auth } from '@clerk/nextjs/server';
export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("timeCapsuleDB");
    
    const now = new Date().toISOString();
    const capsules = await db.collection("timeCapsules")
      .find({
        userId,
        endTime: { $gt: now },  // Only get capsules that haven't ended yet
        groupId: { $in: [null, "", undefined] }  // Only get personal capsules
      })
      .sort({ endTime: 1 })  // Sort by end time, soonest first
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