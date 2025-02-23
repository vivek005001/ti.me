'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface SidebarProps {
  onExpand: (expanded: boolean) => void;
}

interface Group {
  groupID: string;
  name: string;
  members: string[];
  createdBy: string;
}

const Sidebar = ({ onExpand }: SidebarProps) => {
  const pathname = usePathname() || '';
  const [isExpanded, setIsExpanded] = useState(false);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const { user } = useUser();

  const [ownedGroups, setOwnedGroups] = useState<Group[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<Group[]>([]);

  useEffect(() => {
    onExpand(isExpanded);
  }, [isExpanded, onExpand]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groups');
        const data = await response.json();
        if (data.groups) {
          const owned = data.groups.filter((group: Group) => 
            group.createdBy === user?.id
          );
          const joined = data.groups.filter((group: Group) => 
            group.createdBy !== user?.id && group.members.includes(user?.id || '')
          );
          setOwnedGroups(owned);
          setJoinedGroups(joined);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    if (user) {
      fetchGroups();
    }
  }, [user]);

  return (
    <motion.div
      className="fixed top-28 left-0 h-[calc(100vh-6rem)] rounded-r-xl glass overflow-hidden z-30"
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
        
        <div className="flex flex-col">
          <div className="px-2">
            <Link 
              href="/groups"
              className={`flex items-center rounded-lg transition-colors duration-200 ${
                pathname === '/groups' ? 'glass' : 'hover:bg-white/5'
              }`}
            >
              <div className="w-[48px] h-[48px] flex items-center justify-center px-4">
                <span className="material-icons">groups</span>
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

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-3"
              >
                {/* My Groups Section */}
                {ownedGroups.length > 0 && (
                  <div>
                    <div className="pl-12 pr-4 py-1 text-xs text-gray-400 uppercase">
                      My Groups
                    </div>
                    {ownedGroups.map((group) => (
                      <Link
                        key={group.groupID}
                        href={`/groups/${group.groupID}`}
                        className={`flex items-center pl-12 pr-4 py-2 transition-colors duration-200 ${
                          pathname === `/groups/${group.groupID}` ? 'glass' : 'hover:bg-white/5'
                        }`}
                      >
                        <span className="material-icons text-sm mr-2">admin_panel_settings</span>
                        <span className="truncate text-sm">{group.name}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Joined Groups Section */}
                {joinedGroups.length > 0 && (
                  <div>
                    <div className="pl-12 pr-4 py-1 text-xs text-gray-400 uppercase">
                      Joined Groups
                    </div>
                    {joinedGroups.map((group) => (
                      <Link
                        key={group.groupID}
                        href={`/groups/${group.groupID}`}
                        className={`flex items-center pl-12 pr-4 py-2 transition-colors duration-200 ${
                          pathname === `/groups/${group.groupID}` ? 'glass' : 'hover:bg-white/5'
                        }`}
                      >
                        <span className="material-icons text-sm mr-2">group_add</span>
                        <span className="truncate text-sm">{group.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar; 