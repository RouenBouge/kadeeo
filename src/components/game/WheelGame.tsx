import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Prize } from '../../types/establishment';
import { selectRandomPrize } from '../../utils/prizeUtils';

interface WheelGameProps {
  onComplete: (prize: Prize) => void;
  logoUrl: string;
  prizes: Prize[];
}

export const WheelGame: React.FC<WheelGameProps> = ({
  onComplete,
  logoUrl,
  prizes
}) => {
  const [isSpinning, setIsSpinning] = useState(true);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  
  const SYMBOLS = ['🎉', '🎊', '🎈', '🎁', '🌟', '💫', '✨', '🎯', '🎪'];
  const REEL_ITEMS = 15;
  const ITEM_HEIGHT = 100;

  const generateReelItems = () => {
    const items = [];
    for (let i = 0; i < REEL_ITEMS; i++) {
      items.push(i === 7 ? 'logo' : SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    }
    return items;
  };

  const [reels] = useState([
    generateReelItems(),
    generateReelItems(),
    generateReelItems()
  ]);

  useEffect(() => {
    const spinDuration = 4000;
    const spinDelay = 500;
    const finalPosition = (7.5) * ITEM_HEIGHT;

    // Sélectionner un lot aléatoire
    const prize = selectRandomPrize(prizes);
    if (prize) {
      setSelectedPrize(prize);
    }

    // Animation des rouleaux
    reels.forEach((_, index) => {
      setTimeout(() => {
        const reel = document.getElementById(`reel-${index}`);
        if (reel) {
          reel.style.transition = `transform ${spinDuration}ms cubic-bezier(.17,.67,.12,.99)`;
          reel.style.transform = `translateY(-${finalPosition}px)`;
        }

        if (index === reels.length - 1) {
          setTimeout(() => {
            setIsSpinning(false);
            if (prize) {
              setTimeout(() => onComplete(prize), 1000);
            }
          }, spinDuration);
        }
      }, index * spinDelay);
    });
  }, [prizes, onComplete]);

  return (
    <div className="relative bg-gradient-to-b from-blue-900 to-blue-800 p-8 rounded-xl shadow-2xl max-w-2xl mx-auto">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCwyOCAwIDEsMSA1NiwwYTI4LDI4IDAgMSwxIC01NiwwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=')] opacity-10"></div>

      <div className="relative">
        <div className="flex justify-center space-x-4 mb-8">
          {reels.map((reel, reelIndex) => (
            <div
              key={reelIndex}
              className="relative w-24 h-[300px] overflow-hidden bg-white/10 rounded-lg shadow-inner"
            >
              <div
                id={`reel-${reelIndex}`}
                className="absolute top-0 left-0 w-full"
                style={{ transform: 'translateY(0)' }}
              >
                {reel.map((symbol, symbolIndex) => (
                  <div
                    key={symbolIndex}
                    className="h-[100px] flex items-center justify-center"
                  >
                    {symbol === 'logo' ? (
                      <div className="w-20 h-20 p-2 bg-white rounded-lg flex items-center justify-center">
                        <img
                          src={logoUrl || 'https://via.placeholder.com/80'}
                          alt="Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-6xl">{symbol}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xl font-medium text-white/90 animate-pulse">
            {isSpinning ? 'La chance tourne...' : 'Félicitations !'}
          </p>
        </div>
      </div>
    </div>
  );
};