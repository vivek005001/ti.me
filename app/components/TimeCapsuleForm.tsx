'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface TimeCapsuleFormProps {
  groupId: string;
}

export default function TimeCapsuleForm({ groupId }: TimeCapsuleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [unlockDate, setUnlockDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('groupId', groupId);
      formData.append('unlockDate', unlockDate);

      // Append each file individually
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/timecapsules', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create time capsule');
      }

      router.refresh();
      // Reset form
      setTitle('');
      setDescription('');
      setFiles([]);
      setUnlockDate('');
    } catch (error) {
      console.error('Error creating time capsule:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="files" className="block text-sm font-medium text-gray-300">
          Photos/Videos
        </label>
        <input
          type="file"
          id="files"
          onChange={handleFileChange}
          accept="image/*,video/*"
          multiple
          required
          className="mt-1 block w-full text-sm text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-500 file:text-white
            hover:file:bg-blue-600"
        />
        {files.length > 0 && (
          <div className="mt-2 text-sm text-gray-400">
            Selected files: {files.length}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="unlockDate" className="block text-sm font-medium text-gray-300">
          Unlock Date
        </label>
        <input
          type="datetime-local"
          id="unlockDate"
          value={unlockDate}
          onChange={(e) => setUnlockDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create Time Capsule'}
      </button>
    </form>
  );
} 