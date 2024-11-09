import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface GameConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  establishmentId: string;
}

export const GameConditionsModal: React.FC<GameConditionsModalProps> = ({
  isOpen,
  onClose,
  establishmentId,
}) => {
  const [conditions, setConditions] = useState('');

  useEffect(() => {
    if (establishmentId) {
      const establishments = JSON.parse(localStorage.getItem('establishments') || '[]');
      const establishment = establishments.find((e: any) => e.id === establishmentId);
      if (establishment) {
        setConditions(establishment.gameConditions || defaultConditions);
      }
    }
  }, [establishmentId]);

  const handleSave = () => {
    const establishments = JSON.parse(localStorage.getItem('establishments') || '[]');
    const updatedEstablishments = establishments.map((est: any) => {
      if (est.id === establishmentId) {
        return { ...est, gameConditions: conditions };
      }
      return est;
    });
    
    localStorage.setItem('establishments', JSON.stringify(updatedEstablishments));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Conditions du jeu</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <textarea
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            className="w-full h-96 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Saisissez les conditions du jeu..."
          />
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const defaultConditions = `CONDITIONS GÉNÉRALES DU JEU

1. ORGANISATION
Ce jeu est organisé par [Nom de l'établissement], dans le but de récompenser ses clients fidèles.

2. PARTICIPATION
- Le jeu est ouvert à toute personne physique majeure
- Une seule participation par personne est autorisée
- La participation est gratuite et sans obligation d'achat

3. DÉROULEMENT DU JEU
- Le participant doit scanner le QR code fourni par l'établissement
- Il doit laisser un avis Google authentique
- Un lot est attribué de manière aléatoire parmi les lots disponibles

4. LOTS
- Les lots sont attribués selon leur disponibilité
- Ils ne peuvent être ni échangés, ni remboursés
- La validité des lots est de 30 jours après leur obtention

5. RÉCUPÉRATION DES LOTS
- Les lots sont à récupérer directement dans l'établissement
- Une pièce d'identité pourra être demandée
- Le code unique reçu par email devra être présenté

6. RESPONSABILITÉ
L'établissement se réserve le droit de modifier ou d'annuler le jeu en cas de force majeure.

7. DONNÉES PERSONNELLES
Les données collectées sont utilisées uniquement dans le cadre du jeu et ne seront pas transmises à des tiers.`;