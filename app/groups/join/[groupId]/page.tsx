'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function JoinGroupPage({ params }: { params: { groupID: string } }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const joinGroup = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/groups/share', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            groupID: params.groupID,
            userId: user.id
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to join group');
        }

        // Redirect to the group page after successful join
        router.push(`/groups/${params.groupID}`);
      } catch (error) {
        console.error('Error joining group:', error);
        router.push('/groups'); // Redirect to groups page on error
      }
    };

    joinGroup();
  }, [user, params.groupID, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Joining group...</h1>
        <p className="text-gray-400">Please wait while we add you to the group.</p>
      </div>
    </div>
  );
} 