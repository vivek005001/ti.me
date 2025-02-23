'use client';
import { useState, useEffect } from 'react';
import CreateGroupModal from '../components/CreateGroupModal';
import GroupCard from '../components/GroupCard';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface Group {
  _id: string;
  groupID: string;
  name: string;
  description: string;
  isPrivate: boolean;
  createdBy: string;
  members: string[];
  createdAt: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
        await fetchGroups(); // Refresh the groups list
        setIsCreateModalOpen(false); // Close the modal
        router.refresh(); // Force a refresh of the page
      }
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Groups</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Create Group
        </button>
      </div>

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateGroup}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <GroupCard key={group.groupID || group._id} group={group} />
        ))}
      </div>
    </div>
  );
} 