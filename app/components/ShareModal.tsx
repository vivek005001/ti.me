import React, { useState } from 'react';
import Modal from './Modal';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShareById: (userId: string) => void;
  onShareByLink: () => Promise<string>;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onShareById, onShareByLink }) => {
  const [userId, setUserId] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async () => {
    const link = await onShareByLink();
    setShareableLink(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Share Group</h2>
        
        <div className="mb-4">
          <h3 className="text-lg mb-2">Share by ID</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
              className="flex-1 p-2 bg-gray-700 rounded"
            />
            <button
              onClick={() => {
                onShareById(userId);
                setUserId('');
              }}
              className="bg-blue-500 px-4 py-2 rounded"
            >
              Share
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg mb-2">Share via Link</h3>
          {shareableLink ? (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={shareableLink}
                readOnly
                className="flex-1 p-2 bg-gray-700 rounded"
              />
              <span className="text-green-400 text-sm">
                {copied ? 'Copied!' : ''}
              </span>
            </div>
          ) : (
            <button
              onClick={handleGenerateLink}
              className="bg-blue-500 px-4 py-2 rounded w-full"
            >
              Generate Link
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal; 