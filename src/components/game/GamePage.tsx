import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trophy, Star } from 'lucide-react';
import { WheelGame } from './WheelGame';
import { PrizeForm } from './PrizeForm';

export const GamePage: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('initial');
  const { establishmentId } = useParams();
  const [selectedPrizeId, setSelectedPrizeId] = useState<string | null>(null);
  const [establishment, setEstablishment] = useState<Establishment | null>(null);

  useEffect(() => {
    if (establishmentId) {
      const establishments = JSON.parse(localStorage.getItem('establishments') || '[]');
      const found = establishments.find((e: any) => e.id === establishmentId);
      if (found) {
        setEstablishment(found);
      }
    }
  }, [establishmentId]);

  const handleGameComplete = (prizeId: string) => {
    setSelectedPrizeId(prizeId);
    
    // Mettre à jour la quantité restante du lot gagné
    if (establishment && establishmentId) {
      const updatedEstablishment = {
        ...establishment,
        prizes: establishment.prizes.map(prize => 
          prize.id === prizeId
            ? { ...prize, remainingQuantity: prize.remainingQuantity - 1 }
            : prize
        )
      };

      // Mettre à jour le localStorage
      const establishments = JSON.parse(localStorage.getItem('establishments') || '[]');
      const updatedEstablishments = establishments.map((est: Establishment) =>
        est.id === establishmentId ? updatedEstablishment : est
      );
      localStorage.setItem('establishments', JSON.stringify(updatedEstablishments));
      setEstablishment(updatedEstablishment);
    }

    setGameState('won');
  };

  // ... reste du code inchangé ...

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      {/* ... autres états du jeu ... */}

      {gameState === 'playing' && establishment && (
        <WheelGame
          onComplete={handleGameComplete}
          logoUrl={establishment.logoUrl}
          establishmentId={establishmentId}
          prizes={establishment.prizes}
        />
      )}

      {gameState === 'won' && establishment && selectedPrizeId && (
        <div className="bg-white rounded-xl p-8 shadow-xl max-w-md mx-auto space-y-6">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h3 className="text-2xl font-bold">Félicitations !</h3>
          <p className="text-lg">
            Vous avez gagné : <br />
            <span className="font-bold text-xl">
              {establishment.prizes.find(p => p.id === selectedPrizeId)?.name}
            </span>
          </p>
          <button
            onClick={() => setGameState('form')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Récupérer mon lot
          </button>
        </div>
      )}

      {/* ... reste du code inchangé ... */}
    </div>
  );
};