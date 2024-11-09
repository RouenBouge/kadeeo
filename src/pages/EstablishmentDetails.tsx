import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { EstablishmentDashboard } from '../components/admin/EstablishmentDashboard';
import { Establishment } from '../types/establishment';

export const EstablishmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [establishment, setEstablishment] = useState<Establishment | null>(null);

  useEffect(() => {
    if (!id) return;

    const establishments = JSON.parse(localStorage.getItem('establishments') || '[]');
    const found = establishments.find((e: Establishment) => e.id === id);
    
    if (!found) {
      navigate('/admin');
      return;
    }

    if (user?.role === 'ADMIN' && user.establishmentId !== id) {
      navigate('/admin');
      return;
    }

    setEstablishment(found);
  }, [id, user, navigate]);

  if (!establishment) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user?.role === 'SUPER_ADMIN' && (
          <div className="mb-8">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour au tableau de bord
            </button>
          </div>
        )}
        
        <EstablishmentDashboard establishment={establishment} />
      </div>
    </div>
  );
};