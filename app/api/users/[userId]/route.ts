import { createClerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
    const user = await clerk.users.getUser(params.userId);
    return NextResponse.json({ imageUrl: user.imageUrl });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}