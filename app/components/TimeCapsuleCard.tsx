import React, { useState } from 'react';
import { TimeCapsuleData } from '../types';
import ShareModal from './ShareModal';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface TimeCapsuleCardProps {
  capsule: TimeCapsuleData;
}

const TimeCapsuleCard: React.FC<TimeCapsuleCardProps> = ({ capsule }) => {
  const router = useRouter();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { user } = useUser();
  const isOwner = user?.id === capsule.userId;
  const isUnlocked = new Date(capsule.endTime) <= new Date();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateProgress = () => {
    const now = new Date().getTime();
    const start = new Date(capsule.createdAt).getTime();
    const end = new Date(capsule.endTime).getTime();
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    
    const elapsed = now - start;
    const total = end - start;
    const progress = (elapsed / total) * 100;
    const finalProgress = Math.min(Math.max(Math.round(progress * 60), 0), 100);
    return finalProgress;
  };

  const getTimeLeft = () => {
    const now = new Date().getTime();
    const end = new Date(capsule.endTime).getTime();
    const timeLeft = end - now;

    if (timeLeft <= 0) return 'Unlocked';

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h left`;
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

  const handleCapsuleClick = () => {
    if (isUnlocked) {
      router.push(`/capsule/${capsule._id}`);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-white">{capsule.caption}</h3>
        <div className="flex gap-2 items-center">
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <span className="material-icons text-sm">
              {isUnlocked ? 'lock_open' : 'lock'}
            </span>
            {formatDate(capsule.endTime)}
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

      {capsule.files?.[0] && (
        <div 
          className="relative cursor-pointer" 
          onClick={handleCapsuleClick}
        >
          <div className={`relative ${!isUnlocked ? 'blur-md' : ''}`}>
            {capsule.files[0].fileType === 'image' ? (
              <img 
                src={capsule.files[0].fileData}
                alt={capsule.caption}
                className="w-full h-48 object-cover rounded"
              />
            ) : (
              <video 
                src={capsule.files[0].fileData}
                className="w-full h-48 object-cover rounded"
                controls={isUnlocked}
              />
            )}
            {capsule.files.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-sm text-white">
                +{capsule.files.length - 1} more
              </div>
            )}
          </div>
          
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-icons text-4xl text-white">lock</span>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">{capsule.caption}</h3>
        <p className="text-gray-300">{capsule.description}</p>
        
        {capsule.location && (
          <div className="flex items-center gap-2 text-gray-300">
            <span className="material-icons text-sm">location_on</span>
            <span>{capsule.location}</span>
          </div>
        )}

        <div className="flex justify-between text-sm text-gray-400">
          <span>{formatDate(capsule.createdAt)}</span>
          <span>{getTimeLeft()}</span>
        </div>
        <div className="relative w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="absolute left-0 bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${calculateProgress()}%`,
              minWidth: '2px',
              maxWidth: '100%'
            }}
          />
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShareById={handleShare}
        onShareByLink={() => Promise.resolve(capsule._id)}
      />
    </div>
  );
};

export default TimeCapsuleCard; 