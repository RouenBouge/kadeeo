import React from 'react';
import { Store, Users, Award, BarChart3 } from 'lucide-react';
import { User } from '../../types/user';
import { Establishment } from '../../types/establishment';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('500', '100')}`}>
        {icon}
      </div>
    </div>
  </div>
);

export const DashboardStats: React.FC = () => {
  const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  const establishments: Establishment[] = JSON.parse(localStorage.getItem('establishments') || '[]');

  const stats = [
    {
      title: 'Établissements',
      value: establishments.length,
      icon: <Store className="w-6 h-6 text-blue-500" />,
      color: 'border-blue-500'
    },
    {
      title: 'Utilisateurs',
      value: users.length,
      icon: <Users className="w-6 h-6 text-emerald-500" />,
      color: 'border-emerald-500'
    },
    {
      title: 'Admins',
      value: users.filter(u => u.role === 'ADMIN').length,
      icon: <Award className="w-6 h-6 text-purple-500" />,
      color: 'border-purple-500'
    },
    {
      title: 'Super Admins',
      value: users.filter(u => u.role === 'SUPER_ADMIN').length,
      icon: <BarChart3 className="w-6 h-6 text-amber-500" />,
      color: 'border-amber-500'
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};