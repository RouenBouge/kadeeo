import React from 'react';
import { X } from 'lucide-react';
import QRCode from 'qrcode.react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  establishmentId: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  establishmentId,
}) => {
  if (!isOpen) return null;

  const gameUrl = `${window.location.origin}/game/${establishmentId}`;

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-code-${establishmentId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Code QR du jeu</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <QRCode
            id="qr-code"
            value={gameUrl}
            size={256}
            level="H"
            includeMargin={true}
          />
          
          <div className="text-sm text-gray-500 text-center mt-2">
            <p>URL du jeu :</p>
            <a href={gameUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 break-all">
              {gameUrl}
            </a>
          </div>

          <button
            onClick={downloadQR}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Télécharger le QR Code
          </button>
        </div>
      </div>
    </div>
  );
};