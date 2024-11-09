import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trophy, Star, FileText } from 'lucide-react';
import { WheelGame } from '../components/game/WheelGame';
import { PrizeForm } from '../components/game/PrizeForm';
import { Establishment, Prize } from '../types/establishment';

type GameState = 'initial' | 'review' | 'ready' | 'playing' | 'won' | 'form' | 'thanks';

export const GamePage = () => {
  const [gameState, setGameState] = useState<GameState>('initial');
  const { establishmentId } = useParams();
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [showConditions, setShowConditions] = useState(false);

  useEffect(() => {
    if (establishmentId) {
      const establishments = JSON.parse(localStorage.getItem('establishments') || '[]');
      const found = establishments.find((e: any) => e.id === establishmentId);
      if (found) {
        setEstablishment(found);
      }
    }
  }, [establishmentId]);

  const handleReviewClick = () => {
    if (establishment?.googleReviewLink) {
      window.open(establishment.googleReviewLink, '_blank');
      setGameState('playing');
    }
  };

  const handleGameComplete = (prize: Prize) => {
    if (!establishmentId || !establishment) return;

    // Mettre à jour la quantité restante du lot
    const updatedPrizes = establishment.prizes.map(p => 
      p.id === prize.id 
        ? { ...p, remainingQuantity: p.remainingQuantity - 1 }
        : p
    );

    // Mettre à jour l'établissement
    const establishments = JSON.parse(localStorage.getItem('establishments') || '[]');
    const updatedEstablishments = establishments.map((est: Establishment) =>
      est.id === establishmentId
        ? { ...est, prizes: updatedPrizes }
        : est
    );

    // Sauvegarder les modifications
    localStorage.setItem('establishments', JSON.stringify(updatedEstablishments));
    setEstablishment({ ...establishment, prizes: updatedPrizes });
    setSelectedPrize(prize);
    setGameState('form');
  };

  const handleFormComplete = () => {
    setGameState('thanks');
  };

  if (!establishment) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <img
            src={establishment.logoUrl || 'https://via.placeholder.com/200x100'}
            alt={establishment.name}
            className="h-20 mx-auto mb-4 object-contain"
          />
          <h1 className="text-4xl font-bold mb-2">{establishment.name}</h1>
          <h2 className="text-2xl font-bold mb-8">VOUS OFFRE DES CADEAUX</h2>
        </div>

        {gameState === 'initial' && (
          <div className="bg-white rounded-xl p-8 shadow-xl max-w-md mx-auto space-y-6">
            <Star className="w-16 h-16 mx-auto text-yellow-500" />
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Participez et gagnez !</h3>
              <p className="text-gray-600">
                1. Laissez un avis Google<br />
                2. Revenez sur cette page<br />
                3. Découvrez votre lot
              </p>
              <button
                onClick={handleReviewClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all"
              >
                Laisser un avis Google
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <WheelGame
            onComplete={handleGameComplete}
            logoUrl={establishment.logoUrl || ''}
            prizes={establishment.prizes}
          />
        )}

        {gameState === 'form' && selectedPrize && (
          <PrizeForm
            establishmentName={establishment.name}
            prize={selectedPrize.name}
            onComplete={handleFormComplete}
            establishmentId={establishmentId || ''}
          />
        )}

        {gameState === 'thanks' && (
          <div className="bg-white rounded-xl p-8 shadow-xl max-w-md mx-auto space-y-6">
            <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
            <h3 className="text-2xl font-bold">Merci pour votre participation !</h3>
            <p className="text-lg">
              Vous allez recevoir votre lot par email.<br />
              Vous pourrez le récupérer lors de votre prochaine visite.
            </p>
          </div>
        )}

        <button
          onClick={() => setShowConditions(true)}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          <FileText className="w-4 h-4 inline-block mr-1" />
          Conditions du jeu
        </button>

        {showConditions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Conditions du jeu</h3>
                <button
                  onClick={() => setShowConditions(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </div>
              <div className="prose prose-sm">
                {establishment.gameConditions || 'Aucune condition spécifiée.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};