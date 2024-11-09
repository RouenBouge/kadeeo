import React, { useState } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { CheckCircle, AlertCircle, Gift, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const ScanPage = () => {
  const { user } = useAuth();
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    participant?: any;
  } | null>(null);
  const [showScanner, setShowScanner] = useState(true);

  const handleScan = (data: string) => {
    try {
      // Format attendu: kadeeo:prize:{establishmentId}:{participantId}
      const [prefix, type, establishmentId, participantId] = data.split(':');
      
      if (prefix !== 'kadeeo' || type !== 'prize') {
        throw new Error('QR code invalide');
      }

      // Vérifier que l'employé appartient au bon établissement
      if (user?.establishmentId !== establishmentId) {
        throw new Error('Ce lot ne correspond pas à votre établissement');
      }

      // Récupérer les participants
      const participants = JSON.parse(localStorage.getItem(`participants_${establishmentId}`) || '[]');
      const participant = participants.find((p: any) => p.id === participantId);

      if (!participant) {
        throw new Error('Participant non trouvé');
      }

      if (participant.redeemed) {
        throw new Error('Ce lot a déjà été récupéré');
      }

      setScanResult({
        success: true,
        message: 'Lot trouvé !',
        participant
      });
      setShowScanner(false);

    } catch (error: any) {
      setScanResult({
        success: false,
        message: error.message || 'Une erreur est survenue'
      });
    }
  };

  const handleDeactivate = () => {
    if (!scanResult?.participant || !user?.establishmentId) return;

    const participants = JSON.parse(localStorage.getItem(`participants_${user.establishmentId}`) || '[]');
    const updatedParticipants = participants.map((p: any) =>
      p.id === scanResult.participant.id
        ? { ...p, redeemed: true, redeemedAt: new Date().toISOString() }
        : p
    );

    localStorage.setItem(`participants_${user.establishmentId}`, JSON.stringify(updatedParticipants));

    setScanResult({
      ...scanResult,
      message: 'Lot désactivé avec succès !'
    });
  };

  const resetScan = () => {
    setScanResult(null);
    setShowScanner(true);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Scanner un lot</h1>
        </div>

        {scanResult && !showScanner ? (
          <div className="p-6">
            <div className={`rounded-lg mb-6 ${
              scanResult.success ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
            } p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Gift className={`w-6 h-6 ${scanResult.success ? 'text-green-500' : 'text-red-500'} mr-3`} />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {scanResult.success ? 'Lot trouvé' : 'Erreur'}
                  </h2>
                </div>
                <button onClick={resetScan} className="text-gray-400 hover:text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {scanResult.success && scanResult.participant ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Date de gain</p>
                      <p className="font-medium">
                        {new Date(scanResult.participant.participatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lot gagné</p>
                      <p className="font-medium">{scanResult.participant.prizeName}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Informations du gagnant</h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-500">Email :</span>{' '}
                        <span className="font-medium">{scanResult.participant.email}</span>
                      </p>
                      {scanResult.participant.phone && (
                        <p className="text-sm">
                          <span className="text-gray-500">Téléphone :</span>{' '}
                          <span className="font-medium">{scanResult.participant.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleDeactivate}
                    className="w-full mt-4 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                    disabled={scanResult.participant.redeemed}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {scanResult.participant.redeemed 
                      ? 'Lot déjà désactivé'
                      : 'Désactiver le lot'
                    }
                  </button>
                </div>
              ) : (
                <p className="text-red-800">{scanResult.message}</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <p className="text-gray-600 text-sm">
                Placez le QR code du client dans le champ de la caméra pour valider son lot.
              </p>
            </div>

            <div className="aspect-square">
              <QrScanner
                onDecode={handleScan}
                onError={(error) => console.error(error)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};