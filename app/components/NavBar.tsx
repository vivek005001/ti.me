'use client';

import { useUser, UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { useState } from 'react';

const NavBar = () => {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);
  
  const handleShare = async (): Promise<void> => {
    if (user?.id) {
      try {
        await navigator.clipboard.writeText(user.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center gap-4 bg-zinc-900 z-50 border-b border-zinc-800">
      <div className="flex items-center">
        <span className="text-2xl font-bold text-white">TimeCapsule</span>
      </div>
      
      <div className="flex items-center gap-4">
        <SignedIn>
          <button
            onClick={handleShare}
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {copied ? 'Copied!' : 'Share'}
          </button>
          <UserButton afterSignOutUrl="/"/>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal"/>
        </SignedOut>
      </div>
    </nav>
  );
};

export default NavBar; 