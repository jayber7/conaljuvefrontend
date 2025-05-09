import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import NewsDetailPage from './pages/NewsDetailPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
// LoginPage y RegisterPage serán Modales, no rutas dedicadas
import CommitteePage from './pages/committees/CommitteePage'; // O importa cada uno: JuventudPage, ProfesionalesPage, etc.
import CompleteProfileModal from './components/Auth/CompleteProfileModal';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'; // Ajusta ruta si es necesario
import TermsOfServicePage from './pages/TermsOfServicePage'; // Ajusta ruta
import MemberRegistrationPage from './pages/MemberRegistrationPage';
import InstitutionPage from './pages/institution/InstitutionPage';
import FederationListPage from './pages/federations/FederationListPage';
import FederationDetailPage from './pages/federations/FederationDetailPage';
import ProjectPage from './pages/ProjectPage';
import ContactPage from './pages/ContactPage';
import HowToBeMemberPage from './pages/HowToBeMemberPage';
import TribunalListPage from './pages/tribunals/TribunalListPage'; // <-- Importar página de lista

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}> {/* Layout persistente */}
        <Route index element={<HomePage />} />
        <Route path="/sobre-conaljuve" element={<AboutPage />} /> {/* Ruta específica */}
        <Route path="/noticia/:id" element={<NewsDetailPage />} />
        <Route path="/sobre-conaljuve" element={<AboutPage />} />
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
        {/* --- NUEVA RUTA --- */}
        {/* Esta ruta renderizará el placeholder, pero MainLayout
            detectará !isProfileComplete y abrirá el modal */}
        <Route
          path="/completar-perfil"
          element={
             // Protegerla para que solo usuarios logueados puedan acceder
             
              <ProtectedRoute roles={['USER', 'STAFF', 'ADMIN']}>
                  <CompleteProfileModal />
              </ProtectedRoute>
           }
         />
        <Route path="/institucion" element={<Navigate to="/sobre-conaljuve" replace />} />
        <Route path="/institucion/:sectionId" element={<InstitutionPage />} />
        <Route path="/registro-miembro" element={<MemberRegistrationPage />} /> {/* Ruta pública */}
        {/* Páginas de Listado */}
        <Route path="/federaciones" element={<Navigate to="/federaciones/dptales" replace />} />
         <Route path="/federaciones/dptales" element={<FederationListPage type="dptales" title="Federaciones Departamentales"/>} />
         <Route path="/federaciones/muni" element={<FederationListPage type="muni" title="Federaciones Municipales"/>} />
         <Route path="/coordinadoras" element={<FederationListPage type="coord" title="Coordinadoras Departamentales"/>} />
         {/* Páginas de Detalle */}
         <Route path="/federaciones/dptales/:deptId" element={<FederationDetailPage type="dptales" />} />
         <Route path="/federaciones/muni/:deptId" element={<FederationDetailPage type="muni" />} />
         <Route path="/coordinadoras/:deptId" element={<FederationDetailPage type="coord" />} />
          {/* Rutas específicas si las hay */}
         <Route path="/federaciones/dptales/directorio" element={<InstitutionPage sectionId="directorio-nacional" />} /> {/* Ejemplo */}
         <Route path="/federaciones/dptales/estatuto" element={<InstitutionPage sectionId="estatuto-fed-dptal" />} /> {/* Ejemplo */}
         {/* --- Rutas Comités --- */}
        {/* Redirigir /comites a la primera sección o crear página de listado */}
        <Route path="/comites" element={<Navigate to="/comites/juventud" replace />} />
        <Route path="/comites/:committeeId" element={<CommitteePage />} /> {/* Ya acepta ID */}
        <Route path="/proyectos" element={<ProtectedRoute roles={['USER','STAFF', 'ADMIN']}><ProjectPage /></ProtectedRoute>} />
        <Route path="/politica-privacidad" element={<PrivacyPolicyPage />} />
        <Route path="/terminos-servicio" element={<TermsOfServicePage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/como-ser-miembro" element={<HowToBeMemberPage />} />
        <Route path="/tribunales" element={<TribunalListPage />} />

        {/* Cualquier otra ruta */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;