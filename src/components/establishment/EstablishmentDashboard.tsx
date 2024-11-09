import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ParticipantsTable } from './ParticipantsTable';
import { GameSettings } from './GameSettings';
import { EstablishmentStats } from './EstablishmentStats';
import { PrizesManagement } from './PrizesManagement';
import { ProfitabilityTab } from './ProfitabilityTab';
import { GameConditionsTab } from './GameConditionsTab';
import { Settings, Gift, Users, TrendingUp, QrCode, FileText } from 'lucide-react';
import { QRCodeModal } from '../admin/QRCodeModal';
import { Establishment } from '../../types/establishment';
import { Participant } from '../../types/participant';

export const EstablishmentDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeTab, setActiveTab] = useState('game');

  useEffect(() => {
    if (id) {
      const establishments = JSON.parse(localStorage.getItem('establishments') || '[]');
      const found = establishments.find((e: Establishment) => e.id === id);
      if (found) {
        setEstablishment(found);
      }

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

  if (!establishment) {
    return <div>Chargement...</div>;
  }

  const claimedPrizes = participants.filter(p => p.redeemed).length;

  const tabs = [
    { id: 'game', label: 'Configuration', icon: Settings },
    { id: 'prizes', label: 'Lots', icon: Gift },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'profitability', label: 'Rentabilité', icon: TrendingUp },
    { id: 'conditions', label: 'Conditions', icon: FileText },
  ];

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
        claimedPrizes={claimedPrizes}
        totalScans={participants.length}
      />

      <div className="mt-8">
        <Tabs defaultValue="game" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white p-1 rounded-lg shadow-sm border mb-6 flex flex-wrap gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="flex items-center px-4 py-2 rounded-md min-w-[120px] justify-center"
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </TabsTrigger>
            ))}
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
              onClaimPrize={(id) => {
                const updatedParticipants = participants.map(p =>
                  p.id === id ? { ...p, redeemed: !p.redeemed } : p
                );
                localStorage.setItem(`participants_${establishment.id}`, JSON.stringify(updatedParticipants));
                setParticipants(updatedParticipants);
              }}
              onDeleteParticipant={(id) => {
                const updatedParticipants = participants.filter(p => p.id !== id);
                localStorage.setItem(`participants_${establishment.id}`, JSON.stringify(updatedParticipants));
                setParticipants(updatedParticipants);
              }}
            />
          </TabsContent>

          <TabsContent value="profitability">
            <ProfitabilityTab
              establishmentId={establishment.id}
              totalParticipants={participants.length}
              claimedPrizes={claimedPrizes}
            />
          </TabsContent>

          <TabsContent value="conditions">
            <GameConditionsTab
              establishment={establishment}
              onUpdate={handleSettingsUpdate}
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