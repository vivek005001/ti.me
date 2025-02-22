import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';
import ShareModal from './ShareModal';

interface GroupCardProps {
  group: {
    _id: string;
    name: string;
    description: string;
    createdBy: string;
    members: string[];
    createdAt: string;
    isPrivate: boolean;
  };
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const { user } = useUser();
  const isOwner = user?.id === group.createdBy;
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShareById = async (userId: string) => {
    try {
      const response = await fetch('/api/groups/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId: group._id,
          userId: userId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to share group');
      }

      // Close the modal after successful share
      setIsShareModalOpen(false);
    } catch (error) {
      console.error('Error sharing group:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleShareByLink = async () => {
    // Generate a shareable link using the group ID
    const shareableLink = `${window.location.origin}/groups/join/${group._id}`;
    // Copy to clipboard
    await navigator.clipboard.writeText(shareableLink);
    return shareableLink;
  };

  return (
    <div>
      <Link href={`/groups/${group._id}`}>
        <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
          <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
          <p className="text-gray-400 mb-4">{group.description}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{group.members.length} members</span>
            {isOwner && <span className="text-blue-400">Owner</span>}
            <span className={`text-sm ${group.isPrivate ? 'text-red-400' : 'text-green-400'}`}>
              {group.isPrivate ? 'Private' : 'Public'}
            </span>
            {group.isPrivate && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsShareModalOpen(true);
                }}
                className="text-blue-400"
              >
                Share
              </button>
            )}
          </div>
        </div>
      </Link>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShareById={handleShareById}
        onShareByLink={handleShareByLink}
      />
    </div>
  );
};

export default GroupCard; 