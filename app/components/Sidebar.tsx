'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 h-screen fixed left-0 top-0 p-4">
      <div className="space-y-4 mt-16">
        <Link 
          href="/"
          className={`block p-3 rounded-lg ${
            pathname === '/' ? 'bg-blue-600' : 'hover:bg-gray-800'
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
            pathname.startsWith('/groups') ? 'bg-blue-600' : 'hover:bg-gray-800'
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