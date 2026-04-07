import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import CalculatorPage from './pages/Calculator';
import Portfolio from './pages/Portfolio';
import Alerts from './pages/Alerts';
import News from './pages/News';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  console.log('ProtectedRoute rendering...', { user, loading });
  
  if (loading) {
    console.log('ProtectedRoute: loading is true, returning null');
    return null; 
  }
  
  if (!user) {
    console.log('ProtectedRoute: user is null, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('ProtectedRoute: user authenticated, rendering children');
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="calculator" element={<CalculatorPage />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="news" element={<News />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
