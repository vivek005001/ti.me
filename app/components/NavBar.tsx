'use client';

import { useUser, UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
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
    <nav className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center gap-4 glass z-50 border-b border-zinc-800">
      <div className="flex items-center">
        <Link href="/"> 
        <span className="text-2xl font-bold text-white">TimeIt</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <SignedIn>
          <button
            onClick={handleShare}
            className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
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