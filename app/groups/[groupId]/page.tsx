'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TimeCapsuleForm from '@/app/components/TimeCapsuleForm';
import UpcomingCapsules from '@/app/components/GroupCapsules';
import { motion } from 'framer-motion';
import { TimeCapsuleData } from '@/app/types';
import TimeCapsuleList from '@/app/components/TimeCapsuleList';
import Lottie from 'react-lottie-player';
import loadingAnimation from '@/public/animations/loading.json';

interface Group {
  name: string;
  description: string;
}

const GroupDetailsPage = () => {
  const params = useParams();
  const groupId = params?.groupId as string;
  const [group, setGroup] = useState<Group | null>(null);
  const [timeCapsules, setTimeCapsules] = useState<TimeCapsuleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (groupId) {
        await Promise.all([fetchGroupDetails(), fetchGroupCapsules()]);
      }
    };
    fetchData();
  }, [groupId]);

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`);
      const data = await response.json();
      if (data.success) {
        setGroup(data.group);
      }
    } catch (error) {
      console.error('Failed to fetch group details:', error);
    }
  };

  const fetchGroupCapsules = async () => {
    try {
      const response = await fetch(`/api/groups/capsules?groupId=${groupId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched capsules data:', data); // Debug log

      if (data.success) {
        setTimeCapsules(data.capsules);
      } else {
        console.error('Failed to fetch capsules:', data.error);
      }
    } catch (error) {
      console.error('Error fetching group capsules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (capsuleData: any) => {
    try {
      console.log('Submitting capsule with data:', { ...capsuleData, groupId });
      const response = await fetch('/api/groups/capsules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...capsuleData,
          groupId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Response was not JSON");
      }

      const result = await response.json();
      console.log('Response from server:', result);
      
      if (result.success) {
        fetchGroupCapsules();
      } else {
        console.error('Failed to create capsule:', result.error);
      }
    } catch (error) {
      console.error('Failed to create group capsule:', error);
    }
  };

  return (
    <div className="min-h-screen text-white p-4 mt-16 rounded-xl">
      <div className="mx-auto p-4">
        {group && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8 flex items-center justify-between bg-gray-800 rounded-xl p-6"
          >
            <div>
              <h1 className="text-4xl font-bold text-white">{group.name}</h1>
              <p className="text-gray-400 mt-2">{group.description}</p>
            </div>
          </motion.div>
        )}

        <div className="flex gap-6">
          {isLoading ? (
            <div className="flex justify-center items-center w-full h-full">
              <Lottie
                loop
                animationData={loadingAnimation}
                play
                style={{ width: 150, height: 150 }}
              />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-[70%]"
              >
                <TimeCapsuleForm onSubmit={handleSubmit} />
                <div className="mt-8">
                  <TimeCapsuleList 
                    timeCapsules={timeCapsules}
                    isLoading={isLoading}
                    // onCapsuleUpdate={fetchGroupCapsules}
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-[30%]"
              >
                <UpcomingCapsules groupId={groupId} />
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsPage;