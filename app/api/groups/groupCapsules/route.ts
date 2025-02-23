import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { TimeCapsuleData } from '@/app/types';
import { auth } from '@clerk/nextjs/server';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const groupId = String(searchParams.get('groupId'));
      
      if (!groupId) {
        return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
      }

      const authResult = await auth();
      if (!authResult) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const client = await clientPromise;
      const db = client.db("timeCapsuleDB");
  
      // Ensure groupId is treated as a string
      const capsules = await db.collection("timeCapsules")
        .find({ groupId: groupId })
        .sort({ createdAt: -1 })
        .toArray();
      return NextResponse.json({ success: true, capsules });
    } catch (error) {
      console.error('Error fetching time capsules:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch time capsules' },
        { status: 500 }
      );
    }
} 