import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, RequireAuth } from 'miaoda-auth-react';
import { supabase } from '@/db/supabase';
import { Toaster } from '@/components/ui/toaster';

import routes from './routes';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider client={supabase}>
        <Toaster />
        <RequireAuth whiteList={['/', '/login', '/signup']}>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </RequireAuth>
      </AuthProvider>
    </Router>
  );
};

export default App;
