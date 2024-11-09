import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { GamePage } from './pages/GamePage';
import { EstablishmentDetails } from './pages/EstablishmentDetails';
import { LandingPage } from './pages/LandingPage';
import { ScanPage } from './pages/ScanPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/game/:establishmentId" element={<GamePage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/establishments/:id" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <EstablishmentDetails />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/scan" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ScanPage />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;