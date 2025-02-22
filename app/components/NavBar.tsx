'use client';

import { useUser, UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { useState } from 'react';

const NavBar = () => {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);
  
  const handleShare = async () => {
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
    <nav className="p-4 flex justify-end items-center gap-4">
      <SignedIn>
        <button
          onClick={handleShare}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          
          {copied ? 'Copied!' : 'Share'}
        </button>
        <UserButton afterSignOutUrl="/"/>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal"/>
      </SignedOut>
    </nav>
  );
};

export default NavBar; 