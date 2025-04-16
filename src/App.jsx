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
import CommitteePage from './pages/committees/CommitteePage'; // O importa cada uno: JuventudPage, ProfesionalesPage, etc.

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}> {/* Layout persistente */}
        <Route index element={<HomePage />} />
        <Route path="/noticia/:id" element={<NewsDetailPage />} />
        <Route path="/sobre-conaljuve" element={<AboutPage />} />
        {/* --- RUTAS PARA COMITÉS --- */}
        {/* Opción A: Usar un componente genérico pasando el tipo */}
        <Route path="/comites/juventud" element={<CommitteePage committeeId="juventud" />} />
        <Route path="/comites/profesionales" element={<CommitteePage committeeId="profesionales" />} />
        <Route path="/comites/mujeres" element={<CommitteePage committeeId="mujeres" />} />
        <Route path="/comites/salud" element={<CommitteePage committeeId="salud" />} />
        <Route path="/comites/aliados" element={<CommitteePage committeeId="aliados" />} />
        {/* Ruta protegida para Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['ADMIN', 'STAFF']}> {/* Permitir a Admin y Staff */}
            {/* <ProtectedRoute roles={['ADMIN']}>  */}
             {/* O si solo admin puede ver toda la página: <ProtectedRoute roles={['ADMIN']}> */}
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