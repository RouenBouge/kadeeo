import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Establishment, Prize } from '../types/establishment';

export const Game = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showPrize, setShowPrize] = useState(false);

  useEffect(() => {
    const loadEstablishment = () => {
      const establishments = JSON.parse(localStorage.getItem('establishments') || '[]');
      const found = establishments.find((e: Establishment) => e.id === id);
      if (found && found.prizes && found.prizes.length > 0) {
        setEstablishment(found);
      } else {
        console.error('Establishment not found or has no prizes');
      }
    };

    loadEstablishment();
  }, [id]);

  const spinWheel = () => {
    if (!establishment || !establishment.prizes.length) return;

    setIsSpinning(true);
    setShowPrize(false);

    // Randomly select a prize
    const randomIndex = Math.floor(Math.random() * establishment.prizes.length);
    const prize = establishment.prizes[randomIndex];

    // Simulate spinning animation
    setTimeout(() => {
      setSelectedPrize(prize);
      setIsSpinning(false);
      setShowPrize(true);
    }, 3000);
  };

  const handleReviewClick = () => {
    if (establishment?.googleReviewLink) {
      window.open(establishment.googleReviewLink, '_blank');
    }
  };

  if (!establishment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{establishment.name}</h1>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {!showPrize ? (
          <div className="text-center">
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className={`px-6 py-3 text-lg font-semibold rounded-full ${
                isSpinning
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSpinning ? 'Tirage en cours...' : 'Tenter ma chance'}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Félicitations !
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Vous avez gagné : {selectedPrize?.name}
            </p>
            <button
              onClick={handleReviewClick}
              className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 mb-4"
            >
              Laisser un avis pour récupérer votre lot
            </button>
          </div>
        )}
      </div>
    </div>
  );
};