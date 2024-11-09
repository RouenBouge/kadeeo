import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface Prize {
  id: string;
  name: string;
  weeklyLimit: number;
}

interface Establishment {
  id: string;
  name: string;
  googleUrl: string;
  prizes: Prize[];
}

interface EditEstablishmentModalProps {
  establishment: Establishment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (establishment: Establishment) => void;
}

export const EditEstablishmentModal: React.FC<EditEstablishmentModalProps> = ({
  establishment,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Establishment>({
    id: '',
    name: '',
    googleUrl: '',
    prizes: [],
  });

  useEffect(() => {
    if (establishment) {
      setFormData(establishment);
    } else {
      setFormData({
        id: Date.now().toString(),
        name: '',
        googleUrl: '',
        prizes: [],
      });
    }
  }, [establishment, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const addPrize = () => {
    setFormData(prev => ({
      ...prev,
      prizes: [...prev.prizes, {
        id: Date.now().toString(),
        name: '',
        weeklyLimit: 50,
      }],
    }));
  };

  const removePrize = (prizeId: string) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.filter(prize => prize.id !== prizeId),
    }));
  };

  const updatePrize = (prizeId: string, field: keyof Prize, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.map(prize => 
        prize.id === prizeId 
          ? { ...prize, [field]: field === 'weeklyLimit' ? parseInt(value as string) || 0 : value }
          : prize
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {establishment ? 'Modifier' : 'Ajouter'} un établissement
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'établissement
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Google
            </label>
            <input
              type="url"
              name="googleUrl"
              value={formData.googleUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Lots à gagner</h3>
              <button
                type="button"
                onClick={addPrize}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter un lot
              </button>
            </div>

            {formData.prizes.map((prize) => (
              <div key={prize.id} className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-grow space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du lot
                      </label>
                      <input
                        type="text"
                        value={prize.name}
                        onChange={(e) => updatePrize(prize.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Limite hebdomadaire
                      </label>
                      <input
                        type="number"
                        value={prize.weeklyLimit}
                        onChange={(e) => updatePrize(prize.id, 'weeklyLimit', e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePrize(prize.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};