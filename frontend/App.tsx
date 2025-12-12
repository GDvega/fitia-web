import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { useUserStore } from './store/userStore';
import { UserProfile } from './types';

import LoginPage from './components/LoginPage';

const App: React.FC = () => {
  const { userProfile, token, fetchUser, userId } = useUserStore();

  // Safety: If we have a token but no profile (e.g. refresh), fetch it.
  React.useEffect(() => {
    if (token && !userProfile && userId) {
      fetchUser(userId).catch(e => {
        console.error("Auto-fetch failed", e);
        // If fetch fails (e.g. invalid token), logout to prevent stuck loading
        if ((e as any).response?.status === 401) {
          localStorage.removeItem('token');
          window.location.reload();
        }
      });
    }
  }, [token, userProfile, userId, fetchUser]);

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
              ? (
                // If we have a token but no profile yet, show loading (prevent flash of Onboarding)
                !userProfile
                  ? <div className="flex items-center justify-center h-screen bg-[#FAF9F4] text-gray-500">Loading profile...</div>
                  : (userProfile.isOnboardingComplete ? <Navigate to="/dashboard" replace /> : <Onboarding />)
              )
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