'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SidebarProps {
  onExpand: (expanded: boolean) => void;
}

const Sidebar = ({ onExpand }: SidebarProps) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    onExpand(isExpanded);
  }, [isExpanded, onExpand]);

  return (
    <motion.div
      className="fixed top-24 left-0 h-[calc(100vh-6rem)] rounded-r-xl glass overflow-hidden z-30"
      animate={{
        width: isExpanded ? 256 : 72
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
    >
      <div className="flex flex-col gap-4 py-4 relative">
        <AnimatePresence>
          {(pathname === '/dashboard' || pathname.startsWith('/groups')) && (
            <motion.div
              className="absolute w-full px-2"
              initial={false}
              animate={{
                y: pathname === '/dashboard' ? 0 : 64,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            >
              <div className="h-[48px] rounded-lg glass" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="px-2">
          <Link 
            href="/dashboard"
            className={`flex items-center rounded-lg transition-colors duration-200 ${
              pathname === '/dashboard' ? 'glass' : 'hover:bg-white/5'
            }`}
          >
            <div className="w-[48px] h-[48px] flex items-center justify-center px-4">
              <span className="material-icons">person</span>
            </div>
            <motion.span
              animate={{
                opacity: isExpanded ? 1 : 0,
                x: isExpanded ? 0 : -20
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut"
              }}
              className="ml-3"
            >
              Personal
            </motion.span>
          </Link>
        </div>
        
        <div className="px-2">
          <Link 
            href="/groups"
            className={`flex items-center rounded-lg transition-colors duration-200 ${
              pathname.startsWith('/groups') ? 'glass' : 'hover:bg-white/5'
            }`}
          >
            <div className="w-[48px] h-[48px] flex items-center justify-center px-4">
              <span className="material-icons">group</span>
            </div>
            <motion.span
              animate={{
                opacity: isExpanded ? 1 : 0,
                x: isExpanded ? 0 : -20
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut"
              }}
              className="ml-3"
            >
              Groups
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar; 