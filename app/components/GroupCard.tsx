import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface GroupCardProps {
  group: {
    _id: string;
    name: string;
    description: string;
    createdBy: string;
    members: string[];
    createdAt: string;
  };
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const { user } = useUser();
  const isOwner = user?.id === group.createdBy;

  return (
    <Link href={`/groups/${group._id}`}>
      <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
        <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
        <p className="text-gray-400 mb-4">{group.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{group.members.length} members</span>
          {isOwner && <span className="text-blue-400">Owner</span>}
        </div>
      </div>
    </Link>
  );
};

export default GroupCard; 