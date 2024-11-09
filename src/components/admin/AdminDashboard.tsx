import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Gift, Settings, LogOut } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useGame();
  const [establishments, setEstablishments] = useState([
    {
      id: 1,
      name: 'Restaurant Example',
      googleUrl: 'https://g.page/...',
      prizes: [
        { name: 'Café', weeklyLimit: 50, remaining: 30 },
        { name: 'Dessert', weeklyLimit: 20, remaining: 15 }
      ]
    }
  ]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/admin/establishments"
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  <Building2 className="mr-2" size={20} />
                  Établissements
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
              >
                <LogOut className="mr-2" size={16} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {establishments.map((establishment) => (
            <div
              key={establishment.id}
              className="bg-white shadow sm:rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {establishment.name}
                </h3>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Lots disponibles</h4>
                  <div className="mt-2 space-y-2">
                    {establishment.prizes.map((prize, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Gift className="mr-2" size={16} />
                          <span>{prize.name}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {prize.remaining}/{prize.weeklyLimit} restants
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                    <Settings className="mr-2" size={16} />
                    Gérer les lots
                  </button>
                  <Link
                    to={`/game/${establishment.id}`}
                    target="_blank"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                  >
                    Voir le jeu
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}