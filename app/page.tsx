'use client'
import React, { useState, useEffect } from 'react'
import TimeCapsuleCard from './components/TimeCapsuleCard'
import { mockTimeCapsules } from './data/mockData'
import { TimeCapsuleData } from './types'
import { useUser, SignIn } from '@clerk/nextjs'

interface FormData {
  description: string;
  caption: string;
  file: File | null;
  endTime: string;
  files: File[];
}

const Page = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [formData, setFormData] = useState<FormData>({
    description: '',
    caption: '',
    file: null,
    endTime: '',
    files: []
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFormData(prev => ({
        ...prev,
        files: Array.from(e.target.files!)
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.description || !formData.caption || !formData.endTime) {
        alert('Please fill in all required fields');
        return;
      }

      const filesData = await Promise.all(
        formData.files.map(async (file) => {
          const fileData = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });

          return {
            fileType: file.type.startsWith('image') ? 'image' as const : 'video' as const,
            fileData
          };
        })
      );

      const newCapsule: TimeCapsuleData = {
        _id: '',
        userId: user?.id || '',
        description: formData.description,
        caption: formData.caption,
        files: filesData,
        endTime: formData.endTime,
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/timeCapsules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCapsule),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchTimeCapsules();
        setFormData({
          description: '',
          caption: '',
          file: null,
          endTime: '',
          files: []
        });
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
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-gray-400">User ID: {user.id}</p>
        </div>
        <div className="space-y-4 mb-8">
          <textarea
            name="description"
            placeholder="Not's your time capsule story"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full bg-gray-800 rounded p-3 text-white"
            rows={4}
          />
          
          <input
            type="text"
            name="caption"
            placeholder="Caption"
            value={formData.caption}
            onChange={handleInputChange}
            className="w-full bg-gray-800 rounded p-3"
          />
          
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full bg-gray-800 rounded p-3"
            accept="image/*,video/*"
            multiple
          />
          
          {formData.files.length > 0 && (
            <p className="text-sm text-gray-400">
              Selected files: {formData.files.length}
            </p>
          )}
          
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
            className="w-full bg-gray-800 rounded p-3"
          />
          
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded float-right"
          >
            Create
          </button>
        </div>

        {/* Time Capsules Grid */}
        <div className="clear-both pt-8">
          <h2 className="text-2xl font-bold mb-4">Your Time Capsules</h2>
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {timeCapsules.map(capsule => (
                <TimeCapsuleCard key={capsule._id} capsule={capsule} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;