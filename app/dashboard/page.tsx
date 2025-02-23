'use client'
import React, { useState, useEffect } from 'react'
import { useUser, SignIn } from '@clerk/nextjs'
import TimeCapsuleForm from '../components/TimeCapsuleForm'
import TimeCapsuleList from '../components/TimeCapsuleList'
import { TimeCapsuleData } from '../types'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import loadingAnimation from '@/public/animations/loading.json' // Path to your Lottie JSON file
import helloAnimation from '@/public/animations/hello.json' // Add this import
import UpcomingCapsules2 from '../components/UpcomingCapsules'

// Dynamically import Lottie component with ssr disabled
const Lottie = dynamic(() => import('react-lottie-player'), {
  ssr: false
});

const DashboardPage = () => {
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
        body: JSON.stringify({
          ...capsuleData,
          isPersonal: 0 // Set to 0 for capsules created from dashboard
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchTimeCapsules();
      }
    } catch (error) {
      console.error('Failed to create time capsule:', error);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Lottie
          loop
          animationData={loadingAnimation}
          play
          style={{ 
            width: 150, 
            height: 150,
            filter: 'invert(40%) sepia(45%) saturate(600%) hue-rotate(240deg) brightness(90%) contrast(85%)'
          }}
        />
      </div>
    );
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
    <div className="min-h-screen text-white  rounded-xl">
      <div className="mx-auto p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="overflow-hidden" style={{ marginTop: -40, marginBottom: -40 }}>
            <Lottie
              animationData={helloAnimation}
              play
              style={{ 
                width: 200, 
                height: 200,
                filter: 'brightness(0) invert(1)',
                background: 'linear-gradient(to right, rgb(233, 213, 255), rgb(199, 213, 255), rgb(255, 255, 255))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              onComplete={() => {
              }}
            />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-200 via-blue-200 to-white bg-clip-text text-transparent">
            {user?.firstName?.charAt(0).toUpperCase() + user?.firstName?.slice(1).toLowerCase()}!
          </h1>
        </div>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TimeCapsuleForm onSubmit={handleSubmit} />
        </motion.div>

        <div className="flex gap-6">
          {isLoading ? (
            <div className="flex justify-center items-center w-full h-full">
              <Lottie
                loop
                animationData={loadingAnimation}
                play
                style={{ 
                  width: 150, 
                  height: 150,
                  filter: 'invert(40%) sepia(45%) saturate(600%) hue-rotate(240deg) brightness(90%) contrast(85%)'
                }}
              />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-[70%] rounded-xl"
              >
                <TimeCapsuleList 
                  timeCapsules={timeCapsules}
                  isLoading={isLoading}
                />
              </motion.div>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-[30%]"
              >
                <UpcomingCapsules2
                groupId={''}
                />
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 