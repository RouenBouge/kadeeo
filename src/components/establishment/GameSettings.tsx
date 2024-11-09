import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, DollarSign, AlertCircle, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Establishment, Prize } from '../../types/establishment';

interface GameSettingsProps {
  establishment: Establishment;
  onUpdate: (settings: Partial<Establishment>) => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({
  establishment,
  onUpdate,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: establishment.name,
    googleReviewLink: establishment.googleReviewLink,
    prizes: establishment.prizes.map(prize => ({
      ...prize,
      remainingQuantity: prize.remainingQuantity ?? prize.quantity,
      weight: prize.weight ?? 1,
      cost: prize.cost ?? 0
    })),
  });

  useEffect(() => {
    setFormData({
      name: establishment.name,
      googleReviewLink: establishment.googleReviewLink,
      prizes: establishment.prizes.map(prize => ({
        ...prize,
        remainingQuantity: prize.remainingQuantity ?? prize.quantity,
        weight: prize.weight ?? 1,
        cost: prize.cost ?? 0
      })),
    });
  }, [establishment]);

  const handleAddPrize = () => {
    const newPrize: Prize = {
      id: crypto.randomUUID(),
      name: '',
      quantity: 1,
      remainingQuantity: 1,
      weight: 1,
      cost: 0
    };

    setFormData(prev => ({
      ...prev,
      prizes: [...prev.prizes, newPrize],
    }));
  };

  const handleRemovePrize = (id: string) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.filter(prize => prize.id !== id),
    }));
  };

  const handlePrizeChange = (id: string, field: keyof Prize | 'cost', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.map(prize =>
        prize.id === id
          ? {
              ...prize,
              [field]: field === 'quantity' || field === 'remainingQuantity' || field === 'weight' || field === 'cost'
                ? Number(value)
                : value,
              ...(field === 'quantity' ? { remainingQuantity: Number(value) } : {})
            }
          : prize
      ),
    }));
  };

  const getTotalWeight = () => {
    return formData.prizes.reduce((sum, prize) => sum + prize.weight, 0);
  };

  const calculateProbability = (weight: number) => {
    const total = getTotalWeight();
    return total > 0 ? (weight / total) * 100 : 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handlePreviewGame = () => {
    navigate(`/game/${establishment.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h2 className="text-lg font-medium text-gray-900">Configuration du jeu</h2>
            <p className="mt-1 text-sm text-gray-500">
              Configurez les paramètres de votre jeu et gérez vos lots.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePreviewGame}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Aperçu du jeu
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom de l'établissement
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lien Google Avis
          </label>
          <input
            type="url"
            value={formData.googleReviewLink}
            onChange={(e) => setFormData(prev => ({ ...prev, googleReviewLink: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Lots à gagner</h3>
            <button
              type="button"
              onClick={handleAddPrize}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un lot
            </button>
          </div>

          {formData.prizes.map((prize) => (
            <div key={prize.id} className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du lot
                  </label>
                  <input
                    type="text"
                    value={prize.name}
                    onChange={(e) => handlePrizeChange(prize.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantité totale
                  </label>
                  <input
                    type="number"
                    value={prize.quantity}
                    onChange={(e) => handlePrizeChange(prize.id, 'quantity', e.target.value)}
                    min="1"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coût unitaire (€)
                  </label>
                  <input
                    type="number"
                    value={prize.cost}
                    onChange={(e) => handlePrizeChange(prize.id, 'cost', e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Probabilité d'apparition
                </label>
                <input
                  type="range"
                  value={prize.weight}
                  onChange={(e) => handlePrizeChange(prize.id, 'weight', e.target.value)}
                  min="1"
                  max="100"
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{calculateProbability(prize.weight).toFixed(1)}%</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePrize(prize.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {formData.prizes.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Aucun lot configuré</p>
              <p className="text-sm text-gray-400">
                Ajoutez des lots pour commencer
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};