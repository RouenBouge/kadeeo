import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ParticipantsTable } from '../establishment/ParticipantsTable';
import { GameSettings } from '../establishment/GameSettings';
import { EstablishmentStats } from '../establishment/EstablishmentStats';
import { PrizesManagement } from '../establishment/PrizesManagement';
import { ProfitabilityTab } from '../establishment/ProfitabilityTab';
import { Settings, Gift, Users, TrendingUp, QrCode } from 'lucide-react';
import { QRCodeModal } from './QRCodeModal';
import { Establishment } from '../../types/establishment';
import { Participant } from '../../types/participant';

export const EstablishmentDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    if (id) {
      // Load establishment data
      const establishments = JSON.parse(localStorage.getItem('establishments') || '[]');
      const found = establishments.find((e: Establishment) => e.id === id);
      if (found) {
        setEstablishment(found);
      }

      // Load participants
      const savedParticipants = JSON.parse(localStorage.getItem(`participants_${id}`) || '[]');
      setParticipants(savedParticipants);
    }
  }, [id]);

  const handleSettingsUpdate = (settings: Partial<Establishment>) => {
    if (!establishment || !id) return;

    const updatedEstablishment = { ...establishment, ...settings };
    const establishments = JSON.parse(localStorage.getItem('establishments') || '[]');
    const updatedEstablishments = establishments.map((est: Establishment) =>
      est.id === id ? updatedEstablishment : est
    );

    localStorage.setItem('establishments', JSON.stringify(updatedEstablishments));
    setEstablishment(updatedEstablishment);
  };

  const handleClaimPrize = (participantId: string) => {
    const updatedParticipants = participants.map(participant =>
      participant.id === participantId
        ? { 
            ...participant, 
            redeemed: !participant.redeemed,
            redeemedAt: !participant.redeemed ? new Date().toISOString() : undefined
          }
        : participant
    );

    localStorage.setItem(`participants_${id}`, JSON.stringify(updatedParticipants));
    setParticipants(updatedParticipants);
  };

  const handleDeleteParticipant = (participantId: string) => {
    const updatedParticipants = participants.filter(p => p.id !== participantId);
    localStorage.setItem(`participants_${id}`, JSON.stringify(updatedParticipants));
    setParticipants(updatedParticipants);
  };

  if (!establishment) {
    return <div>Chargement...</div>;
  }

  const claimedPrizes = participants.filter(p => p.redeemed).length;

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{establishment.name}</h1>
          <p className="text-gray-600 mt-1">Tableau de bord</p>
        </div>
        <button
          onClick={() => setShowQRCode(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <QrCode className="w-5 h-5 mr-2" />
          Voir le QR Code
        </button>
      </div>

      <EstablishmentStats
        totalPrizes={establishment.prizes.length}
        totalParticipants={participants.length}
        totalScans={participants.length}
        claimedPrizes={claimedPrizes}
      />

      <div className="mt-8">
        <Tabs defaultValue="game" className="w-full">
          <TabsList className="bg-white p-1 rounded-lg shadow-sm border mb-6">
            <TabsTrigger value="game" className="flex items-center px-4 py-2 rounded-md">
              <Settings className="w-4 h-4 mr-2" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="prizes" className="flex items-center px-4 py-2 rounded-md">
              <Gift className="w-4 h-4 mr-2" />
              Lots
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex items-center px-4 py-2 rounded-md">
              <Users className="w-4 h-4 mr-2" />
              Participants
            </TabsTrigger>
            <TabsTrigger value="profitability" className="flex items-center px-4 py-2 rounded-md">
              <TrendingUp className="w-4 h-4 mr-2" />
              Rentabilité
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game">
            <GameSettings
              establishment={establishment}
              onUpdate={handleSettingsUpdate}
            />
          </TabsContent>

          <TabsContent value="prizes">
            <PrizesManagement prizes={establishment.prizes} />
          </TabsContent>

          <TabsContent value="participants">
            <ParticipantsTable 
              participants={participants}
              onClaimPrize={handleClaimPrize}
              onDeleteParticipant={handleDeleteParticipant}
            />
          </TabsContent>

          <TabsContent value="profitability">
            <ProfitabilityTab
              establishmentId={establishment.id}
              totalParticipants={participants.length}
              claimedPrizes={claimedPrizes}
            />
          </TabsContent>
        </Tabs>
      </div>

      <QRCodeModal
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
        establishmentId={establishment.id}
      />
    </div>
  );
};