'use client'
import React, { useState, useEffect } from 'react'
import { useUser, SignIn } from '@clerk/nextjs'
import TimeCapsuleForm from './components/TimeCapsuleForm'
import TimeCapsuleList from './components/TimeCapsuleList'
import { TimeCapsuleData } from './types'
import UpcomingCapsules from './components/UpcomingCapsules'

const Page = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [timeCapsules, setTimeCapsules] = useState<TimeCapsuleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTimeCapsules();
  }, []);

  const fetchTimeCapsules = async () => {
    try {
      const response = await fetch('/api/timeCapsules');
      const result = await response.json();
      if (result.capsules) {
        setTimeCapsules(result.capsules);
      }
    } catch (error) {
      console.error('Failed to fetch time capsules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (capsuleData: any) => {
    try {
      const response = await fetch('/api/timeCapsules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(capsuleData),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchTimeCapsules();
      }
    } catch (error) {
      console.error('Failed to create time capsule:', error);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Welcome to TimeCapsuleConn</h1>
          <p className="mb-8">Please sign in to continue</p>
          <SignIn />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-4 mt-16 rounded-xl">
      <div className="mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold">
            Welcome {user?.firstName?.charAt(0).toUpperCase() + user?.firstName?.slice(1).toLowerCase()}!
          </h1>
        </div>
        
        <TimeCapsuleForm onSubmit={handleSubmit} />

        <div className="flex gap-6 ">
          <div className="w-[70%] bg-zinc-900 p-4 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Your Time Capsules</h2>
            <TimeCapsuleList 
              timeCapsules={timeCapsules}
              isLoading={isLoading}
            />
          </div>
          <div className="w-[30%]">
            <UpcomingCapsules />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;