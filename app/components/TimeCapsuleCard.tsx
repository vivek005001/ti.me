import React from 'react';
import { TimeCapsuleData } from '../types';

interface TimeCapsuleCardProps {
  capsule: TimeCapsuleData;
}

const TimeCapsuleCard: React.FC<TimeCapsuleCardProps> = ({ capsule }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-white">{capsule.caption}</h3>
        <span className="text-sm text-gray-400">
          Opens: {formatDate(capsule.endTime)}
        </span>
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
    </div>
  );
};

export default TimeCapsuleCard; 