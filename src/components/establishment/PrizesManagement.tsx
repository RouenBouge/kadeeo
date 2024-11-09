import React from 'react';
import { Prize } from '../../types/establishment';
import { Gift, AlertCircle, CheckCircle, Package } from 'lucide-react';

interface PrizesManagementProps {
  prizes: Prize[];
}

export const PrizesManagement: React.FC<PrizesManagementProps> = ({ prizes }) => {
  const getTotalDistributed = () => {
    return prizes.reduce((sum, prize) => sum + (prize.quantity - prize.remainingQuantity), 0);
  };

  const getTotalRemaining = () => {
    return prizes.reduce((sum, prize) => sum + prize.remainingQuantity, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">État des lots</h3>
        <p className="text-gray-600">Suivez en temps réel l'état de vos lots et leur distribution</p>
      </div>

      {/* Résumé global */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total des lots</p>
              <p className="text-2xl font-bold text-blue-900">
                {prizes.reduce((sum, prize) => sum + prize.quantity, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600 font-medium">Lots distribués</p>
              <p className="text-2xl font-bold text-green-900">{getTotalDistributed()}</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center">
            <Gift className="w-8 h-8 text-amber-600 mr-3" />
            <div>
              <p className="text-sm text-amber-600 font-medium">Lots restants</p>
              <p className="text-2xl font-bold text-amber-900">{getTotalRemaining()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste détaillée des lots */}
      <div className="space-y-4">
        {prizes.map((prize) => {
          const distributedCount = prize.quantity - prize.remainingQuantity;
          const percentage = (prize.remainingQuantity / prize.quantity) * 100;
          const isLow = percentage < 20;

          return (
            <div key={prize.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${isLow ? 'bg-red-100' : 'bg-green-100'} mr-3`}>
                    <Gift className={`w-5 h-5 ${isLow ? 'text-red-600' : 'text-green-600'}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{prize.name}</h4>
                    <p className="text-sm text-gray-500">
                      Probabilité d'apparition : {((prize.weight / prizes.reduce((sum, p) => sum + p.weight, 0)) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                {isLow && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Stock faible
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Stock restant :</span>
                  <span className={`font-medium ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                    {prize.remainingQuantity} sur {prize.quantity}
                  </span>
                </div>

                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all ${
                        isLow ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-gray-50 rounded p-2 text-center">
                    <p className="text-xs text-gray-500">Distribués</p>
                    <p className="text-lg font-medium text-gray-900">{distributedCount}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2 text-center">
                    <p className="text-xs text-gray-500">Restants</p>
                    <p className="text-lg font-medium text-gray-900">{prize.remainingQuantity}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};