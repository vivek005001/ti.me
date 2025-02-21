import React, { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (userId: string) => Promise<void>;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onShare }) => {
  const [userId, setUserId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onShare(userId);
    setUserId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Share Time Capsule</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID"
            className="w-full p-2 mb-4 bg-gray-700 rounded"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded"
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareModal; 