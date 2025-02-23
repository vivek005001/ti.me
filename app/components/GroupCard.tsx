import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';
import ShareModal from './ShareModal';

interface GroupCardProps {
  group: {
    groupID: string;
    name: string;
    description: string;
    isPrivate: boolean;
    ownerId: string;
    members: string[];
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    _id: string;
  };
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const { user } = useUser();
  const isOwner = user?.id === group.createdBy;
  const isMember = group.members.includes(user?.id || '');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShareById = async (userId: string) => {
    try {
      const response = await fetch('/api/groups/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupID: group.groupID,
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
    const shareableLink = `${window.location.origin}/groups/join/${group.groupID}`;
    // Copy to clipboard
    await navigator.clipboard.writeText(shareableLink);
    return shareableLink;
  };

  const handleJoinGroup = async () => {
    try {
      // Debug logs
      console.log('Full group object:', group);
      console.log('Group ID:', group._id);
      console.log('User ID:', user?.id);

      const response = await fetch('/api/groups/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupID: group._id,  // Using _id since that's what's in MongoDB
          userId: user?.id
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Server response:', error);
        throw new Error('Failed to join group');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  return (
    <div>
      <Link href={`/groups/${group.groupID}`}>
        <div className="glass rounded-lg p-4 hover:bg-white/10 transition-colors relative">
          <div className="absolute top-4 right-4">
            <span className="material-icons text-lg" style={{ 
              color: group.isPrivate ? '#ff4444' : '#22c55e' 
            }}>
              {group.isPrivate ? 'lock' : 'public'}
            </span>
          </div>

          <h3 className="text-xl font-semibold mb-2 pr-8">{group.name}</h3>
          <p className="text-gray-400 mb-4">{group.description}</p>
          <div className="flex items-center gap-4 text-sm">
            {group.isPrivate && (
              <div className="flex items-center gap-1">
                <span className="material-icons text-purple-400 text-lg">group</span>
                <span className="text-purple-400">{group.members.length}</span>
              </div>
            )}
            
            {isOwner && (
              <div className="flex items-center">
                <span className="material-icons text-yellow-400 text-lg">workspace_premium</span>
              </div>
            )}

            {group.isPrivate && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsShareModalOpen(true);
                }}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors ml-auto"
              >
                <span className="material-icons text-lg">share</span>
              </button>
            )}

            {!group.isPrivate && !isMember && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleJoinGroup();
                }}
                className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 transition-colors ml-auto group relative"
              >
                <span className="material-icons text-lg">push_pin</span>
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Pin to sidebar
                </span>
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