import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import NewsDetailPage from './pages/NewsDetailPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
// LoginPage y RegisterPage serán Modales, no rutas dedicadas

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}> {/* Layout persistente */}
        <Route index element={<HomePage />} />
        <Route path="/noticia/:id" element={<NewsDetailPage />} />
        <Route path="/sobre-conaljuve" element={<AboutPage />} />

        {/* Ruta protegida para Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminPage/>
              
            </ProtectedRoute>
          }
        />

        {/* Cualquier otra ruta */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;