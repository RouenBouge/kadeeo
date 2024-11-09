import React, { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';

interface SlotMachineProps {
  onComplete: () => void;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ onComplete }) => {
  const [isSpinning, setIsSpinning] = useState(true);
  const SYMBOLS = ['🎁', '⭐', '🎉', '💝', '🎨', '🎸', '🎪', '🎯', '🎲'];
  const SPIN_DURATION = 2000;
  const REEL_ITEMS = 20;

  const [reels] = useState<string[][]>(
    Array(3).fill([]).map(() => 
      Array(REEL_ITEMS).fill('').map(() => 
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      )
    )
  );

  useEffect(() => {
    const spinTimeouts = reels.map((_, index) => {
      return setTimeout(() => {
        const reel = document.getElementById(`reel-${index}`);
        if (reel) {
          reel.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(.17,.67,.12,.99)`;
          reel.style.transform = `translateY(-${(REEL_ITEMS - 3) * 100}px)`;
        }
      }, index * 400);
    });

    const completeTimeout = setTimeout(() => {
      setIsSpinning(false);
      setTimeout(onComplete, 1000);
    }, SPIN_DURATION + 1200);

    return () => {
      spinTimeouts.forEach(clearTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete, reels]);

  return (
    <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-xl shadow-2xl">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCwyOCAwIDEsMSA1NiwwYTI4LDI4IDAgMSwxIC01NiwwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=')] opacity-10"></div>
      
      <div className="relative">
        <div className="flex justify-center mb-6">
          <Gift className="w-12 h-12 text-yellow-500" />
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          {reels.map((reel, reelIndex) => (
            <div
              key={reelIndex}
              className="relative w-24 h-[300px] overflow-hidden bg-white/10 rounded-lg shadow-inner"
            >
              <div
                id={`reel-${reelIndex}`}
                className="absolute top-0 left-0 w-full"
                style={{
                  transform: 'translateY(0)',
                }}
              >
                {reel.map((symbol, symbolIndex) => (
                  <div
                    key={symbolIndex}
                    className="h-[100px] flex items-center justify-center text-6xl"
                    style={{
                      textShadow: '0 0 10px rgba(255,255,255,0.5)',
                    }}
                  >
                    {symbol}
                  </div>
                ))}
              </div>
              
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/20"></div>
              </div>
            </div>
          ))}
        </div>

        {isSpinning && (
          <div className="text-center">
            <p className="text-lg font-medium text-white/80 animate-pulse">
              La chance est en marche...
            </p>
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default SlotMachine;