import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types/user';
import { Plus, Edit2, Trash2, LogIn } from 'lucide-react';
import { UserModal } from './UserModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [establishments] = useState(() => {
    return JSON.parse(localStorage.getItem('establishments') || '[]');
  });
  const navigate = useNavigate();
  const { impersonateUser, user: currentUser } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  const handleAddUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      email: userData.email || '',
      name: userData.name || '',
      role: userData.role || 'ADMIN',
      establishmentId: userData.establishmentId,
      password: userData.password || '',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setIsModalOpen(false);
  };

  const handleEditUser = (userData: Partial<User>) => {
    if (!selectedUser) return;

    const updatedUsers = users.map(user =>
      user.id === selectedUser.id
        ? { ...user, ...userData }
        : user
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setShowDeleteConfirm(null);
  };

  const handleImpersonate = async (user: User) => {
    if (user.role === 'ADMIN' && user.establishmentId) {
      await impersonateUser(user);
      navigate(`/admin/establishments/${user.establishmentId}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Gestion des utilisateurs</h2>
        <button
          onClick={() => {
            setSelectedUser(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un utilisateur
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Établissement</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.role === 'ADMIN' && user.establishmentId
                    ? establishments.find(e => e.id === user.establishmentId)?.name || 'Non trouvé'
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {user.role === 'ADMIN' && (
                    <button
                      onClick={() => handleImpersonate(user)}
                      className="text-green-600 hover:text-green-900"
                      title="Se connecter en tant que cet utilisateur"
                    >
                      <LogIn className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  {currentUser?.role === 'SUPER_ADMIN' && user.id !== currentUser.id && (
                    showDeleteConfirm === user.id ? (
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="text-gray-600 hover:text-gray-900 text-sm"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={selectedUser ? handleEditUser : handleAddUser}
          user={selectedUser}
          establishments={establishments}
        />
      )}
    </div>
  );
};