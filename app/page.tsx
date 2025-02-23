'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const HomePage = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h1 className="text-9xl font-bold mb-6 -mt-20">Time It</h1>
        
        <div className="my-8 w-[600px] h-[600px] mx-auto">
          <img
            src="/animations/kogo-unscreen.gif"
            alt="Logo animation"
            className="w-full h-full object-cover mix-blend-screen"
          />
        </div>
      </div>
      <motion.div className="fixed bottom-10 left-1/2 transform -translate-x-1/2">
        <motion.button
          onClick={handleGetStarted}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-6 py-3 rounded-lg shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Get Started
        </motion.button>
      </motion.div>
    </motion.div>
    
  );
};

export default HomePage;