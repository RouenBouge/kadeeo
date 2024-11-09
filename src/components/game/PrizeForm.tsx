import React, { useState } from 'react';
import { Mail, Phone, AlertCircle } from 'lucide-react';

interface PrizeFormProps {
  establishmentName: string;
  prize: string;
  onComplete: () => void;
  establishmentId: string;
}

export const PrizeForm: React.FC<PrizeFormProps> = ({
  establishmentName,
  prize,
  onComplete,
  establishmentId,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDuplicateParticipation = (email: string, phone: string): boolean => {
    const storageKey = `participants_${establishmentId}`;
    const existingParticipants = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    return existingParticipants.some((participant: any) => 
      (participant.email && participant.email.toLowerCase() === email.toLowerCase()) ||
      (participant.phone && participant.phone === phone)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (checkDuplicateParticipation(formData.email, formData.phone)) {
        setError("Vous avez déjà participé au jeu. Laissez la chance aux autres !");
        setIsSubmitting(false);
        return;
      }

      // Code unique de 8 caractères
      const prizeCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const participant = {
        id: crypto.randomUUID(),
        email: formData.email,
        phone: formData.phone,
        participatedAt: new Date().toISOString(),
        hasWon: true,
        prize,
        prizeCode,
        establishmentId,
        redeemed: false
      };

      const storageKey = `participants_${establishmentId}`;
      const existingParticipants = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updatedParticipants = [...existingParticipants, participant];
      localStorage.setItem(storageKey, JSON.stringify(updatedParticipants));

      console.log('Email envoyé à:', formData.email, {
        establishmentName,
        prize,
        prizeCode,
      });

      setIsSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      console.error('Erreur:', error);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-xl max-w-md mx-auto">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Lot réservé avec succès !</h3>
          <p className="mt-2 text-sm text-gray-600">
            Vous allez recevoir un email avec les détails de votre lot.
            Présentez cet email lors de votre prochaine visite.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-xl max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-center mb-6">Récupérez votre lot !</h3>
      <p className="text-gray-600 mb-6 text-center">
        Entrez vos coordonnées pour recevoir votre {prize} par email
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            required
            placeholder="Votre email"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            required
            placeholder="Votre numéro de téléphone"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Recevoir mon lot'}
        </button>
      </form>
    </div>
  );
};