import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SuperAdminDashboard } from '../components/admin/SuperAdminDashboard';
import { EstablishmentDashboard } from '../components/admin/EstablishmentDashboard';

export const AdminDashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />;
  }

  if (user.role === 'ADMIN' && user.establishmentId) {
    return <EstablishmentDashboard establishment={{ id: user.establishmentId }} />;
  }

  return null;
};