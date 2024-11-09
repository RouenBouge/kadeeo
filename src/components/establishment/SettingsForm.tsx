import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Establishment } from '../../types/establishment';

interface SettingsFormProps {
  establishment: Establishment;
  onUpdate: (settings: Partial<Establishment>) => void;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  establishment,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    address: establishment.address || '',
    phone: establishment.phone || '',
    email: establishment.email || '',
    facebookUrl: establishment.facebookUrl || '',
    instagramUrl: establishment.instagramUrl || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="123 rue Example"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="+33 1 23 45 67 89"
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
            placeholder="contact@example.com"
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
            placeholder="https://facebook.com/votre-page"
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
            placeholder="https://instagram.com/votre-compte"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};