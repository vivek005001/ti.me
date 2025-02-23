'use client';
import { motion } from 'framer-motion';

const BackgroundBlobs = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Top left blob */}
      <motion.div
        className="absolute w-[500px] h-[500px] left-0 top-0 rounded-full bg-purple-700/30 blur-3xl"
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -100, 100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Top right blob */}
      <motion.div
        className="absolute w-[400px] h-[400px] right-0 top-0 rounded-full bg-purple-900/20 blur-3xl"
        animate={{
          x: [0, -100, 100, 0],
          y: [0, 100, -100, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Center blob */}
      <motion.div
        className="absolute w-[600px] h-[600px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-800/25 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Bottom left blob */}
      <motion.div
        className="absolute w-[450px] h-[450px] left-0 bottom-0 rounded-full bg-purple-600/25 blur-3xl"
        animate={{
          x: [0, 150, -150, 0],
          y: [0, -150, 150, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Bottom right blob */}
      <motion.div
        className="absolute w-[550px] h-[550px] right-0 bottom-0 rounded-full bg-purple-500/20 blur-3xl"
        animate={{
          x: [0, -120, 120, 0],
          y: [0, 120, -120, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Top center blob */}
      <motion.div
        className="absolute w-[350px] h-[350px] left-1/2 top-0 -translate-x-1/2 rounded-full bg-purple-400/20 blur-3xl"
        animate={{
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Middle right blob */}
      <motion.div
        className="absolute w-[400px] h-[400px] right-0 top-1/2 -translate-y-1/2 rounded-full bg-purple-300/25 blur-3xl"
        animate={{
          x: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Middle left extra blob */}
      <motion.div
        className="absolute w-[300px] h-[300px] left-0 top-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-3xl"
        animate={{
          x: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Top right corner blob */}
      <motion.div
        className="absolute w-[250px] h-[250px] right-0 top-0 rounded-full bg-purple-700/25 blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Bottom center blob */}
      <motion.div
        className="absolute w-[450px] h-[450px] left-1/2 bottom-0 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl"
        animate={{
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default BackgroundBlobs; 