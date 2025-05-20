import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
}

export default function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="relative overflow-hidden bg-white rounded-lg shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`p-3 rounded-md ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500 truncate">
              {title}
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              {value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 