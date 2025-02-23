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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

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
      if (!formData.description || !formData.caption || !formData.endTime || formData.files.length === 0) {
        alert('Please fill in all required fields and upload at least one file');
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

  const handleReset = () => {
    setFormData({
      description: '',
      caption: '',
      file: null,
      endTime: '',
      files: [],
      location: '',
    });
  };

  const generateAICaption = async () => {
    if (formData.files.length === 0) {
      alert('Please upload images first');
      return;
    }

    try {
      setIsGenerating(true);
      // Clear existing caption first
      setFormData(prev => ({
        ...prev,
        caption: ''
      }));

      const filesData = await Promise.all(
        formData.files.map(async (file) => {
          const fileData = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });
          return fileData;
        })
      );

      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: filesData }),
      });

      const { caption } = await response.json();
      
      setFormData(prev => ({
        ...prev,
        caption: caption
      }));
    } catch (error) {
      console.error('Failed to generate caption:', error);
      alert('Failed to generate caption. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAIDescription = async () => {
    if (formData.files.length === 0) {
      alert('Please upload images first');
      return;
    }

    try {
      setIsGeneratingDesc(true);
      // Clear existing description first
      setFormData(prev => ({
        ...prev,
        description: ''
      }));

      const filesData = await Promise.all(
        formData.files.map(async (file) => {
          const fileData = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });
          return fileData;
        })
      );

      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          images: filesData,
          currentDescription: formData.description
        }),
      });

      const { description } = await response.json();
      
      setFormData(prev => ({
        ...prev,
        description: description
      }));
    } catch (error) {
      console.error('Failed to generate description:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  return (
    <div className="space-y-4 mb-8 glass p-6 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Create Capsule</h2>
        <button
          type="button"
          onClick={handleReset}
          className="p-2 rounded-full transition-colors"
          title="Reset form"
        >
          <span className="material-icons text-gray-400">restart_alt</span>
        </button>
      </div>

      <div className="flex flex-row gap-4 h-48">
        <div className="relative" style={{ flexBasis: '70%' }}>
          <div className="relative h-full">
            <div className={`absolute inset-0 rounded-xl blur-md ${
              isGeneratingDesc 
                ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-white animate-gradient bg-300% shadow-[0_0_30px_rgba(192,132,252,0.5)]' 
                : ''
            }`} />
            <textarea
              name="description"
              placeholder=" "
              value={formData.description}
              onChange={handleInputChange}
              className="flex-grow bg-white/5 backdrop-blur-sm p-3 pt-12 rounded-xl text-white h-full w-full placeholder-gray-200 peer text-lg resize-none relative z-10 
                scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
            />
            <label className="absolute text-gray-200 duration-300 transform -translate-y-4 scale-75 top-4 left-3 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 text-lg">
              Description
            </label>
            <button
              type="button"
              onClick={generateAIDescription}
              disabled={isGeneratingDesc || formData.files.length === 0}
              className="absolute top-2 right-2 p-2 mb-4 rounded-full transition-all duration-300 disabled:opacity-50 disabled:hover:bg-transparent z-20"
              title="Generate AI description"
            >
              <span className={`material-icons ${
                isGeneratingDesc 
                  ? 'bg-gradient-to-r from-purple-200 via-blue-200 to-white bg-clip-text text-transparent bg-300% animate-gradient' 
                  : 'text-white hover:text-purple-200 transition-colors'
              }`}>
                auto_awesome
              </span>
            </button>
          </div>
        </div>

        <div className="relative" style={{ flexBasis: '30%' }}>
          <div className="relative h-full">
            <div className={`absolute inset-0 rounded-xl blur-md ${
              isGenerating 
                ? 'bg-gradient-to-r from-purple-500 to via-blue-500 to-white/40 animate-gradient bg-300% shadow-[0_0_30px_rgba(192,132,252,0.5)]' 
                : ''
            }`} />
            <textarea
              name="caption"
              placeholder=" "
              value={formData.caption}
              onChange={handleInputChange}
className="flex-grow bg-white/5 backdrop-blur-sm p-3 pt-12 rounded-xl text-white h-full w-full placeholder-gray-200 peer text-lg resize-none relative z-10 
                scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
            />            
            <label className="absolute text-gray-200 duration-300 transform -translate-y-4 scale-75 top-4 left-3 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 text-lg">
              Caption
            </label>
            <button
              type="button"
              onClick={generateAICaption}
              disabled={isGenerating || formData.files.length === 0}
              className="absolute top-2 right-2 p-2 mb-2  rounded-full transition-all duration-300 disabled:opacity-50 disabled:hover:bg-transparent z-20"
              title="Generate AI caption"
            >
              <span className={`material-icons ${
                isGenerating 
                  ? 'bg-gradient-to-r from-purple-200 via-blue-200 to-white bg-clip-text text-transparent bg-300% animate-gradient' 
                  : 'text-white hover:text-purple-200 transition-colors'
              }`}>
                auto_awesome
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <div className="cursor-pointer p-3 rounded-xl">
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
              className="absolute mt-2 ml-12 opacity-0  text-white"
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
              className="cursor-pointer p-3  rounded-xl"
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

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-6 py-3 rounded-lg shadow-lg"
            onClick={handleSubmit}
          >
            Create Time Capsule
          </button>
        </div>
      </div>
      
      {formData.files.length > 0 ? (
        <p className="text-sm text-gray-400">
          Selected files: {formData.files.length}
        </p>
      ) : (
        <p className="text-sm text-gray-400">
          *Please select at least one file
        </p>
      )}
    </div>
  );
} 