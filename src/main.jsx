import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import App from './App.jsx'

console.log('Main.jsx execution started');
console.log('App initialization starting...');
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

console.log('Mounting React component tree...');
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </CurrencyProvider>
    </QueryClientProvider>
  </StrictMode>,
)
