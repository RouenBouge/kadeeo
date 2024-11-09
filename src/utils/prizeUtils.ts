import { Prize } from '../types/establishment';

export const selectRandomPrize = (prizes: Prize[]): Prize | null => {
  if (!prizes || prizes.length === 0) {
    console.error('Aucun lot configuré');
    return null;
  }

  // Filtrer les lots disponibles
  const availablePrizes = prizes.filter(prize => 
    prize.remainingQuantity > 0
  );

  if (availablePrizes.length === 0) {
    console.error('Aucun lot disponible');
    return null;
  }

  // Calculer la somme totale des poids
  const totalWeight = availablePrizes.reduce((sum, prize) => sum + prize.weight, 0);
  
  // Générer un nombre aléatoire entre 0 et le poids total
  let random = Math.random() * totalWeight;
  
  // Sélectionner un lot en fonction du poids
  for (const prize of availablePrizes) {
    random -= prize.weight;
    if (random <= 0) {
      return prize;
    }
  }
  
  // Fallback au premier lot disponible si aucun n'est sélectionné
  return availablePrizes[0];
};