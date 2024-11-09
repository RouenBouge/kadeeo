export interface Participant {
  id: string;
  email: string;
  phone?: string;
  establishmentId: string;
  participatedAt: string;
  hasWon: boolean;
  prizeId?: string;
  prizeName?: string;
  prizeCode?: string;
  claimedAt?: string; // Date de récupération du lot
}