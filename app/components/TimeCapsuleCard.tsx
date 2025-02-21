import React, { useState } from 'react';
import { TimeCapsuleData } from '../types';
import ShareModal from './ShareModal';
import { useUser } from '@clerk/nextjs';

interface TimeCapsuleCardProps {
  capsule: TimeCapsuleData;
}

const TimeCapsuleCard: React.FC<TimeCapsuleCardProps> = ({ capsule }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { user } = useUser();

  // Only show share button if the current user is the owner
  const isOwner = user?.id === capsule.userId;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async (targetUserId: string) => {
    try {
      const response = await fetch('/api/timeCapsules/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          capsuleId: capsule._id,
          targetUserId
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }
      setIsShareModalOpen(false);
      alert('Time capsule shared successfully!');
    } catch (error) {
      console.error('Failed to share time capsule:', error);
      alert('Failed to share time capsule');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-white">{capsule.caption}</h3>
        <div className="flex gap-2">
          <span className="text-sm text-gray-400">
            Opens: {formatDate(capsule.endTime)}
          </span>
          {isOwner && (
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Share
            </button>
          )}
        </div>
      </div>
      
      <p className="text-gray-300 line-clamp-2">{capsule.description}</p>
      
      {capsule.fileType === 'image' && capsule.fileData && (
        <img 
          src={capsule.fileData}
          alt={capsule.caption}
          className="w-full h-48 object-cover rounded"
        />
      )}
      
      {capsule.fileType === 'video' && capsule.fileData && (
        <video 
          src={capsule.fileData}
          className="w-full h-48 object-cover rounded"
          controls
        />
      )}
      
      <div className="text-sm text-gray-400">
        Created: {formatDate(capsule.createdAt)}
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShare={handleShare}
      />
    </div>
  );
};

export default TimeCapsuleCard; 