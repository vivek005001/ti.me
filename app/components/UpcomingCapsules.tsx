'use client';
import { useEffect, useState } from 'react';
import { TimeCapsuleData } from '../types';

export default function UpcomingCapsules() {
  const [upcomingCapsules, setUpcomingCapsules] = useState<TimeCapsuleData[]>([]);

  useEffect(() => {
    fetchUpcomingCapsules();
  }, []);

  const fetchUpcomingCapsules = async () => {
    try {
      const response = await fetch('/api/timeCapsules/upcoming');
      const data = await response.json();
      if (data.capsules) {
        // Sort capsules by endTime
        const sortedCapsules = data.capsules.sort((a: TimeCapsuleData, b: TimeCapsuleData) => 
          new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
        );
        setUpcomingCapsules(sortedCapsules);
      }
    } catch (error) {
      console.error('Failed to fetch upcoming capsules:', error);
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

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6">Upcoming capsule events</h2>
      
      <div className="space-y-6">
        {upcomingCapsules.map((capsule) => (
          <div key={capsule._id} className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <span className="material-icons text-white">
                {capsule.files?.[0]?.fileType === 'video' ? 'videocam' : 'photo'}
              </span>
            </div>
            
            <div className="flex-grow">
              <h3 className="font-medium text-white">{capsule.caption}</h3>
              <p className="text-sm text-gray-400">
                {formatDate(capsule.endTime)}, {capsule.location || 'No location'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 