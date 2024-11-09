import React, { useState, useEffect } from 'react';
import { X, Upload, CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AccountInfo {
  managerName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  logo: string;
  instagramUrl: string;
  facebookUrl: string;
  averageBasket: number; // Ajout du panier moyen
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<AccountInfo>({
    managerName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      zipCode: '',
    },
    logo: '',
    instagramUrl: '',
    facebookUrl: '',
    averageBasket: 0, // Initialisation du panier moyen
  });

  useEffect(() => {
    if (user?.establishmentId) {
      const savedInfo = localStorage.getItem(`account_${user.establishmentId}`);
      if (savedInfo) {
        setFormData(JSON.parse(savedInfo));
      }
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.establishmentId) {
      localStorage.setItem(`account_${user.establishmentId}`, JSON.stringify(formData));
      onClose();
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Mon compte</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Panier Moyen */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-start mb-4">
              <CreditCard className="w-5 h-5 text-blue-600 mt-1 mr-2" />
              <div>
                <h3 className="text-lg font-medium text-blue-900">Panier Moyen Client</h3>
                <p className="text-sm text-blue-600">Cette information nous permet de calculer votre retour sur investissement</p>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                value={formData.averageBasket}
                onChange={(e) => setFormData(prev => ({ ...prev, averageBasket: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border rounded-md"
                min="0"
                step="0.01"
                placeholder="Ex: 25.00"
              />
              <span className="ml-2 text-gray-600">€</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du gérant
              </label>
              <input
                type="text"
                value={formData.managerName}
                onChange={(e) => setFormData(prev => ({ ...prev, managerName: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro et rue
              </label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, street: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code postal
              </label>
              <input
                type="text"
                value={formData.address.zipCode}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, zipCode: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Instagram
              </label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Facebook
              </label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, facebookUrl: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo de l'établissement
            </label>
            <div className="mt-1 flex items-center space-x-4">
              {formData.logo && (
                <img
                  src={formData.logo}
                  alt="Logo"
                  className="h-20 w-20 object-contain rounded-lg border"
                />
              )}
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Upload className="w-4 h-4 mr-2" />
                Choisir un logo
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};