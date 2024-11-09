import React from 'react';
import { Gift, Users, CheckCircle, Scan } from 'lucide-react';

interface EstablishmentStatsProps {
  totalPrizes: number;
  totalParticipants: number;
  claimedPrizes: number;
  totalScans: number;
}

export const EstablishmentStats: React.FC<EstablishmentStatsProps> = ({
  totalPrizes,
  totalParticipants,
  claimedPrizes,
  totalScans,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Lots offerts */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center space-x-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <Gift className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-purple-900">Lots offerts</p>
            <h3 className="text-2xl font-bold text-purple-700 mt-1">{totalPrizes}</h3>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-purple-200">
          <p className="text-xs text-purple-600">
            Nombre total de lots configurés
          </p>
        </div>
      </div>

      {/* Participants */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center space-x-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">Participants</p>
            <h3 className="text-2xl font-bold text-blue-700 mt-1">{totalParticipants}</h3>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="text-xs text-blue-600">
            Nombre total de participants
          </p>
        </div>
      </div>

      {/* Lots récupérés */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center space-x-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-900">Lots récupérés</p>
            <h3 className="text-2xl font-bold text-green-700 mt-1">{claimedPrizes}</h3>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-green-200">
          <div className="flex items-center justify-between">
            <p className="text-xs text-green-600">
              Taux de récupération
            </p>
            <p className="text-xs font-medium text-green-700">
              {totalParticipants > 0 
                ? `${Math.round((claimedPrizes / totalParticipants) * 100)}%`
                : '0%'}
            </p>
          </div>
        </div>
      </div>

      {/* Scans QR Code */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center space-x-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <Scan className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-900">Scans QR Code</p>
            <h3 className="text-2xl font-bold text-amber-700 mt-1">{totalScans}</h3>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-amber-200">
          <p className="text-xs text-amber-600">
            Nombre total de scans du QR code
          </p>
        </div>
      </div>
    </div>
  );
};