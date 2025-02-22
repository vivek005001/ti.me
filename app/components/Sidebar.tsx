'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="fixed top-24 left-0 w-64 bg-zinc-900 h-[calc(100vh-5rem)] rounded-r-xl">
      <div className="space-y-4 p-4">
        <Link 
          href="/"
          className={`block p-3 rounded-lg ${
            pathname === '/' ? 'bg-black' : 'hover:bg-zinc-800'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className="material-icons">person</span>
            <span>Personal</span>
          </div>
        </Link>
        
        <Link 
          href="/groups"
          className={`block p-3 rounded-lg ${
            pathname.startsWith('/groups') ? 'bg-black' : 'hover:bg-zinc-800'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className="material-icons">group</span>
            <span>Groups</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar; 