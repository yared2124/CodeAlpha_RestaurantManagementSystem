import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
