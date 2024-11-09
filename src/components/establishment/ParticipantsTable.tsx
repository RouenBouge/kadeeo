import React, { useState } from 'react';
import { Download, Search, Trash2, Check, X, QrCode, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode.react';

interface Participant {
  id: string;
  email: string;
  phone?: string;
  participatedAt: string;
  hasWon: boolean;
  prize?: string;
  prizeCode?: string;
  redeemed?: boolean;
  redeemedAt?: string;
  establishmentId: string;
}

interface ParticipantsTableProps {
  participants: Participant[];
  onClaimPrize?: (participantId: string) => void;
  onDeleteParticipant: (participantId: string) => void;
}

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: Participant;
}

const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, participant }) => {
  if (!isOpen) return null;

  const qrValue = `kadeeo:prize:${participant.establishmentId}:${participant.id}`;

  const downloadQR = () => {
    const canvas = document.getElementById('participant-qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `lot-${participant.prizeCode}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">QR Code du lot</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <QRCode
            id="participant-qr-code"
            value={qrValue}
            size={256}
            level="H"
            includeMargin={true}
          />
          
          <div className="text-sm text-gray-500 text-center mt-2">
            <p>Code du lot : {participant.prizeCode}</p>
            <p>Email : {participant.email}</p>
            {participant.phone && <p>Téléphone : {participant.phone}</p>}
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

export const ParticipantsTable: React.FC<ParticipantsTableProps> = ({ 
  participants,
  onClaimPrize,
  onDeleteParticipant
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  const filteredParticipants = participants.filter(participant =>
    (participant.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (participant.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleDelete = (participantId: string) => {
    onDeleteParticipant(participantId);
    setShowDeleteConfirm(null);
  };

  const exportCSV = () => {
    const headers = ['Email', 'Téléphone', 'Date participation', 'Lot gagné', 'Code', 'Récupéré', 'Date récupération'];
    const csvContent = [
      headers.join(','),
      ...filteredParticipants.map(p => [
        p.email || '',
        p.phone || '',
        new Date(p.participatedAt).toLocaleDateString(),
        p.prize || '-',
        p.prizeCode || '-',
        p.redeemed ? 'Oui' : 'Non',
        p.redeemedAt ? new Date(p.redeemedAt).toLocaleDateString() : '-'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'participants.csv';
    link.click();
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={exportCSV}
            className="ml-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date participation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lot gagné
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  État
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date récupération
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParticipants.map((participant) => (
                <tr key={participant.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {participant.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(participant.participatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {participant.prize || 'Lot gagné'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                    {participant.prizeCode || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onClaimPrize?.(participant.id)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        participant.redeemed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {participant.redeemed ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Récupéré
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-1" />
                          En attente
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.redeemedAt 
                      ? new Date(participant.redeemedAt).toLocaleDateString()
                      : '-'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedParticipant(participant)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir le QR Code"
                      >
                        <QrCode className="w-5 h-5" />
                      </button>
                      <a
                        href={`/admin/scan/${participant.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir la page de scan"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                      {showDeleteConfirm === participant.id ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDelete(participant.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(participant.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedParticipant && (
        <QRModal
          isOpen={true}
          onClose={() => setSelectedParticipant(null)}
          participant={selectedParticipant}
        />
      )}
    </div>
  );
};