import React from 'react';
import { Edit2, Trash2, QrCode } from 'lucide-react';
import { Establishment } from '../../types/establishment';
import { useAuth } from '../../contexts/AuthContext';

interface EstablishmentTableProps {
  establishments: Establishment[];
  onEdit: (establishment: Establishment) => void;
  onDelete: (id: string) => void;
  onShowQR: (id: string) => void;
}

export const EstablishmentTable: React.FC<EstablishmentTableProps> = ({
  establishments,
  onEdit,
  onDelete,
  onShowQR,
}) => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lien Google</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lots</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {establishments.map((establishment) => (
            <tr key={establishment.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{establishment.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <a href={establishment.googleReviewLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  Voir le lien
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {establishment.prizes?.length || 0} lots
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onShowQR(establishment.id)}
                  className="text-purple-600 hover:text-purple-900"
                >
                  <QrCode className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onEdit(establishment)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                {isSuperAdmin && (
                  <button
                    onClick={() => onDelete(establishment.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};