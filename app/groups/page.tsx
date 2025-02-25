'use client';
import { useState, useEffect } from 'react';
import CreateGroupModal from '../components/CreateGroupModal';
import GroupCard from '../components/GroupCard';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Lottie from 'react-lottie-player';
import loadingAnimation from '@/public/animations/loading.json';

interface Group {
  _id: string;
  groupID: string;
  name: string;
  description: string;
  isPrivate: boolean;
  createdBy: string;
  ownerId: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups');
      const data = await response.json();
      if (data.groups) {
        setGroups(data.groups);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (groupData: { name: string; description: string; isPrivate: boolean }) => {
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });

      if (response.ok) {
        await fetchGroups();
        setIsCreateModalOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const myGroups = groups.filter(group => group.createdBy === user?.id || group.members.includes(user?.id || ''));
  const publicGroups = groups.filter(group => !group.isPrivate && !myGroups.includes(group));

  return (
    <div className="min-h-screen p-4 mt-28">
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
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
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 via-blue-200 to-white bg-clip-text text-transparent">
            Groups
          </h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* My Groups Section */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4">My Groups</h2>
              {myGroups.length === 0 ? (
                <p className="text-gray-400">You haven't joined any groups yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myGroups.map((group) => (
                    <GroupCard key={group.groupID || group._id} group={group} />
                  ))}
                </div>
              )}
            </div>

            {/* Public Groups Section */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4">Public Groups</h2>
              {publicGroups.length === 0 ? (
                <p className="text-gray-400">No public groups available.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {publicGroups.map((group) => (
                    <GroupCard key={group.groupID || group._id} group={group} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Sticky Create Group Button */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 z-50 hover:shadow-purple-500/25 hover:shadow-xl"
          >
            <span className="material-icons text-3xl">add</span>
          </motion.button>

          <CreateGroupModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={handleCreateGroup}
          />
        </div>
      )}
    </div>
  );
} 