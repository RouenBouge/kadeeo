import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { EstablishmentTable } from './EstablishmentTable';
import { EstablishmentModal } from './EstablishmentModal';
import { QRCodeModal } from './QRCodeModal';
import { Establishment } from '../../types/establishment';

export const EstablishmentManagement = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedQRId, setSelectedQRId] = useState<string | null>(null);

  useEffect(() => {
    const savedEstablishments = localStorage.getItem('establishments');
    if (savedEstablishments) {
      setEstablishments(JSON.parse(savedEstablishments));
    }
  }, []);

  const saveEstablishments = (newEstablishments: Establishment[]) => {
    localStorage.setItem('establishments', JSON.stringify(newEstablishments));
    setEstablishments(newEstablishments);
  };

  const handleAddEstablishment = (establishmentData: Partial<Establishment>) => {
    const newEstablishment: Establishment = {
      id: crypto.randomUUID(),
      name: establishmentData.name || '',
      googleReviewLink: establishmentData.googleReviewLink || '',
      prizes: establishmentData.prizes || [],
    };

    const newEstablishments = [...establishments, newEstablishment];
    saveEstablishments(newEstablishments);
    setIsModalOpen(false);
  };

  const handleEditEstablishment = (establishmentData: Partial<Establishment>) => {
    if (!selectedEstablishment) return;

    const updatedEstablishments = establishments.map((est) =>
      est.id === selectedEstablishment.id
        ? { ...est, ...establishmentData }
        : est
    );

    saveEstablishments(updatedEstablishments);
    setIsModalOpen(false);
    setSelectedEstablishment(null);
  };

  const handleDeleteEstablishment = (id: string) => {
    const newEstablishments = establishments.filter((est) => est.id !== id);
    saveEstablishments(newEstablishments);
  };

  const handleShowQR = (id: string) => {
    setSelectedQRId(id);
    setShowQRCode(true);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Gestion des établissements
          </h2>
          <button
            onClick={() => {
              setSelectedEstablishment(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un établissement
          </button>
        </div>

        <EstablishmentTable
          establishments={establishments}
          onEdit={(establishment) => {
            setSelectedEstablishment(establishment);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteEstablishment}
          onShowQR={handleShowQR}
        />
      </div>

      {isModalOpen && (
        <EstablishmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEstablishment(null);
          }}
          onSubmit={selectedEstablishment ? handleEditEstablishment : handleAddEstablishment}
          establishment={selectedEstablishment}
          title={selectedEstablishment ? 'Modifier l\'établissement' : 'Ajouter un établissement'}
          submitText={selectedEstablishment ? 'Modifier' : 'Ajouter'}
        />
      )}

      {showQRCode && selectedQRId && (
        <QRCodeModal
          isOpen={showQRCode}
          onClose={() => {
            setShowQRCode(false);
            setSelectedQRId(null);
          }}
          establishmentId={selectedQRId}
        />
      )}
    </div>
  );
};