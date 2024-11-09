import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConditionsModal: React.FC<ConditionsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [conditions, setConditions] = useState('');

  useEffect(() => {
    if (user?.establishmentId) {
      const savedConditions = localStorage.getItem(`conditions_${user.establishmentId}`);
      if (savedConditions) {
        setConditions(savedConditions);
      }
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.establishmentId) {
      localStorage.setItem(`conditions_${user.establishmentId}`, conditions);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Conditions du jeu</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Saisissez les conditions du jeu
            </label>
            <textarea
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              className="w-full h-64 px-3 py-2 border rounded-md resize-none"
              placeholder="Exemple : Le jeu est ouvert à toute personne majeure..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConditionsModal;