import React, { useState } from 'react';
import { Save, FileText } from 'lucide-react';

interface GameConditionsTabProps {
  establishment: {
    id: string;
    gameConditions?: string;
  };
  onUpdate: (settings: Partial<{ gameConditions: string }>) => void;
}

export const GameConditionsTab: React.FC<GameConditionsTabProps> = ({
  establishment,
  onUpdate,
}) => {
  const [conditions, setConditions] = useState(establishment.gameConditions || defaultConditions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ gameConditions: conditions });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <FileText className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Conditions du jeu</h2>
        </div>
        <p className="text-gray-600">
          Personnalisez les conditions générales qui seront affichées aux participants du jeu.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <textarea
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            className="w-full h-96 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Saisissez les conditions du jeu..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </button>
        </div>
      </form>
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