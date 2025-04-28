// src/components/Auth/CompleteProfileModal.stories.jsx

import React, { useState } from 'react';
import CompleteProfileModal from './CompleteProfileModal'; // Ajusta la ruta al componente
import { Button } from '@mui/material'; // Para botón de abrir/cerrar
import { AuthProvider } from '../../contexts/AuthContext'; // Importar por si necesitas simular user

// Configuración básica de la historia
export default {
  title: 'Components/Auth/CompleteProfileModal', // Cómo aparecerá en la barra lateral de Storybook
  component: CompleteProfileModal,
  // Decoradores específicos de esta historia (opcional, si necesitas algo más que los globales)
  // decorators: [(Story) => <div style={{ padding: '20px', background: '#eee' }}><Story/></div>],
  parameters: {
      // Puedes añadir parámetros de configuración aquí
      layout: 'centered', // Centra el componente en el canvas
  },
  // Define los 'args' (props) por defecto y sus tipos para los controles
  argTypes: {
      open: { control: 'boolean' }, // Control booleano (toggle)
      onClose: { action: 'closed' }, // Simula la llamada a onClose mostrando una acción en el panel "Actions"
      // No podemos pasar 'user' directamente como arg si el modal lo lee del contexto.
      // Necesitaremos un decorador o una historia específica para simular estados del contexto.
  },
  args: { // Valores por defecto para las props
    open: true, // Mostrar abierto por defecto en Storybook
  },
};

// --- Plantilla Base ---
// Usamos una plantilla para evitar repetir la lógica de estado open/close en cada historia
const Template = (args) => {
    // Estado local para controlar la apertura DENTRO de la historia
    const [isOpen, setIsOpen] = useState(args.open);

    // Simular onClose actualizando el estado local y llamando a la acción
    const handleClose = () => {
        setIsOpen(false);
        args.onClose(); // Llama a la acción de Storybook
    };

    // Simular usuario (si es necesario para probar diferentes estados)
    // Esto es simplificado. Para pruebas complejas, necesitarías un decorador
    // que provea un AuthContext con un usuario específico.
    const mockUser = args.mockUser; // Pasaremos un usuario simulado como arg

    return (
        // Necesitamos el AuthProvider aquí si el componente usa useAuth internamente
        <AuthProvider>
            {/* Botón para reabrir el modal en Storybook */}
            {!isOpen && <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>}

            {/* Renderizar el modal con los args y el estado local */}
            <CompleteProfileModal
                {...args} // Pasar todos los args (excepto open)
                open={isOpen} // Usar estado local para controlar 'open'
                onClose={handleClose} // Usar handler local
            />

             {/* Opcional: Mostrar el estado del usuario simulado */}
             {/* <pre>Simulated User: {JSON.stringify(mockUser, null, 2)}</pre> */}

        </AuthProvider>
    );
};

// --- Historias Específicas ---

// 1. Estado por Defecto (Nuevo Usuario)
export const Default = Template.bind({});
Default.args = {
  open: true,
  // No pasar mockUser, AuthProvider usará el default (null)
};
Default.storyName = 'Nuevo Usuario (Perfil Incompleto)';

// 2. Estado de Edición (Usuario Existente)
export const EditingProfile = Template.bind({});
EditingProfile.args = {
  open: true,
  // Simular un usuario que ya existe en el contexto
  // Necesitamos una forma de inyectar este usuario en el AuthProvider
  // Esto NO funcionará directamente así, AuthProvider leerá su propio estado.
  // Veremos cómo simular el contexto abajo.
  // mockUser: {
  //     _id: '12345',
  //     name: 'Hiver Tapia (Existente)',
  //     email: 'hiver@example.com',
  //     role: 'USER',
  //     isProfileComplete: true, // Perfil ya completo
  //     profilePictureUrl: 'https://via.placeholder.com/100',
  //     location: { departmentCode: 1, provinceCode: 101, municipalityCode: 10101, zone: 'Centro' }
  // }
};
EditingProfile.storyName = 'Editando Perfil (Completo)';


// --- Cómo Simular el Contexto (Forma más avanzada) ---
// Necesitamos un decorador que envuelva la historia con un AuthProvider
// al que le pasamos un valor de contexto simulado.

const MockAuthProvider = ({ children, mockValue }) => {
    // Valor simulado para el contexto
    const defaultValue = {
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isStaff: false,
        loading: false,
        login: async () => console.log('Mock Login'),
        logout: () => console.log('Mock Logout'),
        register: async () => console.log('Mock Register'),
        refetchUser: async () => console.log('Mock Refetch'),
    };
    // Sobrescribir con valores simulados si se proporcionan
    const value = { ...defaultValue, ...mockValue };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


// Historia para Editar Perfil usando el AuthProvider simulado
export const EditingWithMockContext = (args) => {
     const [isOpen, setIsOpen] = useState(args.open);
     const handleClose = () => { setIsOpen(false); args.onClose(); };

     const loggedInUser = { // Datos del usuario simulado
         _id: '12345',
         name: 'Hiver Tapia (Simulado)',
         email: 'simulado@example.com',
         role: 'USER',
         isProfileComplete: true,
         profilePictureUrl: 'https://via.placeholder.com/100',
         location: { departmentCode: 1, provinceCode: 101, municipalityCode: 10101, zone: 'Centro' }
     };

     // Valor simulado para el contexto
     const mockContextValue = {
         user: loggedInUser,
         isAuthenticated: true,
         isAdmin: false,
         isStaff: false,
         loading: false,
     };

     return (
         // Envolver con el proveedor simulado
         <MockAuthProvider mockValue={mockContextValue}>
             {!isOpen && <Button onClick={() => setIsOpen(true)}>Abrir Modal (Editar Simulado)</Button>}
             <CompleteProfileModal
                 {...args}
                 open={isOpen}
                 onClose={handleClose}
             />
         </MockAuthProvider>
     );
 };
 EditingWithMockContext.args = {
    open: true,
 };
 EditingWithMockContext.storyName = 'Editando Perfil (Contexto Simulado)';


// Puedes crear más historias para:
// - Estado de Carga (simulando loading=true en el contexto)
// - Estado de Éxito
// - Estado con Error
// - Diferentes roles de usuario (Admin/Staff) para ver si algo cambia en el modal