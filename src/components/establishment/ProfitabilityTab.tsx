import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Star, ShoppingCart, ArrowRight, Gift, ArrowDown, ArrowUp } from 'lucide-react';

interface ProfitabilityTabProps {
  establishmentId: string;
  totalParticipants: number;
  claimedPrizes: number;
}

export const ProfitabilityTab: React.FC<ProfitabilityTabProps> = ({
  establishmentId,
  totalParticipants,
  claimedPrizes,
}) => {
  const [averageBasket, setAverageBasket] = useState(0);
  const [prizeCosts, setPrizeCosts] = useState({ total: 0, distributed: 0 });

  useEffect(() => {
    // Charger le panier moyen
    const accountInfo = localStorage.getItem(`account_${establishmentId}`);
    if (accountInfo) {
      const { averageBasket } = JSON.parse(accountInfo);
      setAverageBasket(averageBasket || 0);
    }

    // Calculer les coûts des lots
    const establishments = JSON.parse(localStorage.getItem('establishments') || '[]');
    const establishment = establishments.find((e: any) => e.id === establishmentId);
    
    if (establishment) {
      const totalCost = establishment.prizes.reduce((sum: number, prize: any) => 
        sum + (prize.cost || 0) * prize.quantity, 0);
      
      const distributedCost = establishment.prizes.reduce((sum: number, prize: any) => 
        sum + (prize.cost || 0) * (prize.quantity - prize.remainingQuantity), 0);

      setPrizeCosts({ total: totalCost, distributed: distributedCost });
    }
  }, [establishmentId]);

  // Calculs de rentabilité
  const reviewRevenue = (totalParticipants * averageBasket * 0.03);
  const visitsRevenue = (claimedPrizes * averageBasket * 0.8);
  const totalRevenue = reviewRevenue + visitsRevenue;
  const netProfit = totalRevenue - prizeCosts.distributed;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Simulateur de Rentabilité</h2>
        <p className="text-gray-600">
          Analysez l'impact financier de Kadeeo sur votre établissement
        </p>
      </div>

      {averageBasket === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <ShoppingCart className="w-5 h-5 text-yellow-500 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Panier moyen non configuré</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Configurez votre panier moyen dans les paramètres de votre compte pour voir les estimations de rentabilité.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Revenus générés</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800">Impact des avis</span>
                  </div>
                  <span className="font-semibold text-green-900">+{reviewRevenue.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800">Impact des visites</span>
                  </div>
                  <span className="font-semibold text-green-900">+{visitsRevenue.toFixed(2)} €</span>
                </div>
                <div className="pt-2 border-t border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-800">Total des revenus</span>
                    <span className="text-xl font-bold text-green-900">+{totalRevenue.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Coûts des lots distribués</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Gift className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-800">Lots distribués</span>
                  </div>
                  <span className="font-semibold text-red-900">-{prizeCosts.distributed.toFixed(2)} €</span>
                </div>
                <div className="pt-2 border-t border-red-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-red-800">Total des coûts</span>
                    <span className="text-xl font-bold text-red-900">-{prizeCosts.distributed.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Bilan financier</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ArrowUp className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Revenus</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">+{totalRevenue.toFixed(2)} €</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ArrowDown className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-gray-700">Coûts</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">-{prizeCosts.distributed.toFixed(2)} €</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-gray-700">Bénéfice net</span>
                  </div>
                  <span className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {netProfit >= 0 ? '+' : ''}{netProfit.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails des calculs</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Star className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Impact des avis Google</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {totalParticipants} avis × {(averageBasket * 0.03).toFixed(2)} € = {reviewRevenue.toFixed(2)} €
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Impact des visites en magasin</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {claimedPrizes} lots récupérés × {(averageBasket * 0.8).toFixed(2)} € = {visitsRevenue.toFixed(2)} €
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Gift className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Coût des lots distribués</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Valeur totale des lots distribués : {prizeCosts.distributed.toFixed(2)} €
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};