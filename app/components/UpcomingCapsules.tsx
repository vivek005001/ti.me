'use client';
import { useEffect, useState } from 'react';
import { TimeCapsuleData } from '../types';

interface UpcomingCapsulesProps {
  groupId: string;
}

const UpcomingCapsules: React.FC<UpcomingCapsulesProps> = ({ groupId }) => {
  const [groupCapsules, setGroupCapsules] = useState<TimeCapsuleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (groupId) {
      fetchGroupCapsules();
    }
  }, [groupId]);

  const fetchGroupCapsules = async () => {
    try {
      const response = await fetch(`/api/groups/groupCapsules?groupId=${groupId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        // Sort capsules by creation date
        const sortedCapsules = data.capsules.sort((a: TimeCapsuleData, b: TimeCapsuleData) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setGroupCapsules(sortedCapsules);
      }
    } catch (error) {
      console.error('Failed to fetch group capsules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Group Capsules</h2>
        <div className="text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6">Group Capsules</h2>
      
      {groupCapsules.length === 0 ? (
        <div className="text-center text-gray-400">No capsules found</div>
      ) : (
        <div className="space-y-6">
          {groupCapsules.map((capsule) => (
            <div key={capsule._id} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="material-icons text-white">
                  {capsule.files?.[0]?.fileType === 'video' ? 'videocam' : 'photo'}
                </span>
              </div>
              
              <div className="flex-grow">
                <h3 className="font-medium text-white">{capsule.caption}</h3>
                <p className="text-sm text-gray-400">
                  Created: {formatDate(capsule.createdAt)}
                  {capsule.location && `, ${capsule.location}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingCapsules; 