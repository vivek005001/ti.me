'use client';
import React, { useState, useRef } from 'react';
import LocationInput from './LocationInput';
import { useUser } from '@clerk/nextjs';

interface FormData {
  description: string;
  caption: string;
  file: File | null;
  endTime: string;
  files: File[];
  location: string;
}

interface TimeCapsuleFormProps {
  onSubmit: (capsule: any) => Promise<void>;
}

export default function TimeCapsuleForm({ onSubmit }: TimeCapsuleFormProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState<FormData>({
    description: '',
    caption: '',
    file: null,
    endTime: '',
    files: [],
    location: '',
  });

  const dateInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
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

      await onSubmit({
        userId: user?.id || '',
        description: formData.description,
        caption: formData.caption,
        files: filesData,
        endTime: formData.endTime,
        location: formData.location,
      });

      setFormData({
        description: '',
        caption: '',
        file: null,
        endTime: '',
        files: [],
        location: '',
      });
    } catch (error) {
      console.error('Failed to create time capsule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 mb-8 glass p-6 rounded-xl">
      <div className="flex flex-row gap-4 h-48">
        <div className="relative" style={{ flexBasis: '70%' }}>
          <input
            type="text"
            name="description"
            placeholder=" "
            value={formData.description}
            onChange={handleInputChange}
            className="flex-grow bg-white/10 p-3 pt-8 rounded-xl text-white h-full w-full placeholder-gray-200 peer text-lg"
          />
          <label className="absolute text-gray-200 duration-300 transform -translate-y-4 scale-75 top-4 left-3 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 text-lg">
            Description
          </label>
        </div>

        <div className="relative" style={{ flexBasis: '30%' }}>
          <input
            type="text"
            name="caption"
            placeholder=" "
            value={formData.caption}
            onChange={handleInputChange}
            className="flex-grow bg-white/10 p-3 pt-8 rounded-xl text-white h-full w-full placeholder-gray-200 peer text-lg"
          />
          <label className="absolute text-gray-200 duration-300 transform -translate-y-4 scale-75 top-4 left-3 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 text-lg">
            Caption
          </label>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <div className="cursor-pointer p-3 hover:bg-zinc-800 rounded-xl">
            <label className="cursor-pointer">
              <span className="material-icons text-white">attach_file</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*"
                multiple
              />
            </label>
          </div>

          <div className="relative inline-flex items-center">
            <input
              id="endTime"
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className="absolute mt-2 ml-12 opacity-0 bg-zinc-900 text-white"
              style={{ 
                top: '100%', 
                left: 0, 
                zIndex: 50,
                colorScheme: 'dark'  // This helps with the native picker's theme
              }}
              ref={dateInputRef}
            />
            <button 
              type="button"
              onClick={() => dateInputRef.current?.showPicker()}
              className="cursor-pointer p-3 hover:bg-zinc-800 rounded-xl"
            >
              <span className="material-icons text-white">event</span>
            </button>
            {formData.endTime && (
              <span className="text-sm text-gray-400 ml-2">
                {new Date(formData.endTime).toLocaleString()}
              </span>
            )}
          </div>

          <div className="relative">
            <LocationInput
              value={formData.location}
              onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-6 py-3 rounded-lg shadow-lg"
        >
          Create Time Capsule
        </button>
      </div>
      
      {formData.files.length > 0 && (
        <p className="text-sm text-gray-400">
          Selected files: {formData.files.length}
        </p>
      )}
    </div>
  );
} 