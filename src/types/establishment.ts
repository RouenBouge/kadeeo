export interface Prize {
  id: string;
  name: string;
  quantity: number;
  remainingQuantity: number;
  weight: number;
  cost?: number; // Ajout du coût unitaire du lot
}

// ... reste du fichier inchangé ...