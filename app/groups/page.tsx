'use client';
import { useState, useEffect } from 'react';
import CreateGroupModal from '../components/CreateGroupModal';
import GroupCard from '../components/GroupCard';
import { useUser } from '@clerk/nextjs';

interface Group {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  members: string[];
  createdAt: string;
  isPrivate: boolean;
}

export default function GroupsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groups');
        const data = await response.json();
        if (data.groups) {
          setGroups(data.groups);
        }
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      }
    };

    if (user) {
      fetchGroups();
    }
  }, [user]);

  const handleCreateGroup = async (groupData: { name: string; description: string; isPrivate: boolean }) => {
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...groupData,
          createdBy: user?.id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGroups([...groups, data.group]);
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  return (
    <div className="ml-64 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <GroupCard key={group._id} group={group} />
        ))}
      </div>

      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
      >
        <span className="material-icons">add</span>
      </button>

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateGroup}
      />
    </div>
  );
} 