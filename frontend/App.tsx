import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { useUserStore } from './store/userStore';
import { UserProfile } from './types';

import LoginPage from './components/LoginPage';

const App: React.FC = () => {
  const { userProfile, token, fetchUser, userId } = useUserStore();

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/login"
          element={!token ? <LoginPage /> : <Navigate to="/" replace />}
        />

        <Route
          path="/"
          element={
            token
              ? (userProfile?.isOnboardingComplete ? <Navigate to="/dashboard" replace /> : <Onboarding />)
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/dashboard"
          element={
            token && userProfile?.isOnboardingComplete
              ? <Dashboard />
              : <Navigate to="/" replace />
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default App;