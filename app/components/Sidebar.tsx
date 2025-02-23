'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="fixed top-24 left-0 w-64 glass h-[calc(100vh-5rem)] rounded-r-xl">
      <div className="space-y-4 p-4">
        <Link 
          href="/dashboard"
          className={`block p-3 rounded-lg ${
            pathname === '/dashboard' ? 'glass' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className="material-icons">person</span>
            <Link href="/dashboard">
            <span>Personal</span>
            </Link>
          </div>
        </Link>
        
        <Link 
          href="/groups"
          className={`block p-3 rounded-lg ${
            pathname.startsWith('/groups') ? 'glass' : ''
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