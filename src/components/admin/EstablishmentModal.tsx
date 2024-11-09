import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Establishment, Prize } from '../../types/establishment';

interface EstablishmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (establishment: Partial<Establishment>) => void;
  establishment?: Establishment;
  title: string;
  submitText: string;
}

export const EstablishmentModal: React.FC<EstablishmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  establishment,
  title,
  submitText,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    googleReviewLink: '',
    prizes: [] as Prize[],
  });

  useEffect(() => {
    if (establishment) {
      setFormData({
        name: establishment.name || '',
        googleReviewLink: establishment.googleReviewLink || '',
        prizes: establishment.prizes || [],
      });
    } else {
      setFormData({
        name: '',
        googleReviewLink: '',
        prizes: [],
      });
    }
  }, [establishment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addPrize = () => {
    const newPrize: Prize = {
      id: `prize-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: '',
      quantity: 1
    };
    setFormData(prev => ({
      ...prev,
      prizes: [...prev.prizes, newPrize],
    }));
  };

  const updatePrize = (index: number, field: keyof Prize, value: string | number) => {
    const updatedPrizes = formData.prizes.map((prize, i) => {
      if (i === index) {
        return { ...prize, [field]: value };
      }
      return prize;
    });
    setFormData(prev => ({
      ...prev,
      prizes: updatedPrizes,
    }));
  };

  const removePrize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'établissement
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lien Google Review
            </label>
            <input
              type="url"
              value={formData.googleReviewLink}
              onChange={(e) => setFormData(prev => ({ ...prev, googleReviewLink: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Lots à gagner</label>
              <button
                type="button"
                onClick={addPrize}
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter un lot
              </button>
            </div>

            {formData.prizes.map((prize, index) => (
              <div key={prize.id} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={prize.name}
                  onChange={(e) => updatePrize(index, 'name', e.target.value)}
                  placeholder="Nom du lot"
                  className="flex-1 p-2 border rounded-md"
                  required
                />
                <input
                  type="number"
                  value={prize.quantity}
                  onChange={(e) => updatePrize(index, 'quantity', parseInt(e.target.value) || 0)}
                  min="1"
                  className="w-20 p-2 border rounded-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => removePrize(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};