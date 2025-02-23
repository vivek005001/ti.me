'use client';
import { useEffect, useState } from 'react';
import { TimeCapsuleData } from '../types';

interface UpcomingCapsulesProps {
  groupId: string;
}

const UpcomingCapsules2: React.FC<UpcomingCapsulesProps> = ({ groupId }) => {
  const [groupCapsules, setGroupCapsules] = useState<TimeCapsuleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGroupCapsules();
  }, []);

  const fetchGroupCapsules = async () => {
    try {
      const response = await fetch('/api/timeCapsules/upcoming');
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
        <h2 className="text-xl font-semibold mb-6">Upcoming Capsules</h2>
        <div className="text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6">Upcoming Capsules</h2>
      
      {groupCapsules.length === 0 ? (
        <div className="text-center text-gray-400">No capsules found</div>
      ) : (
        <div className="space-y-6">
          {groupCapsules.map((capsule) => (
            <div key={capsule._id} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                {capsule.files?.[0]?.fileData ? (
                  <>
                    <img 
                      src={capsule.files[0].fileData}
                      alt={capsule.caption}
                      className="w-full h-full object-cover blur-sm"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="material-icons text-white">
                      {capsule.files?.[0]?.fileType === 'video' ? 'videocam' : 'photo'}
                    </span>
                  </div>
                )}
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

export default UpcomingCapsules2; 