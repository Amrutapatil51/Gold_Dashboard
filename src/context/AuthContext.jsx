import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Initialization hook triggered');
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        console.log('AuthContext: Parsing stored user data from localStorage');
        setUser(JSON.parse(storedUser));
      } catch (err) {
<<<<<<< HEAD
        console.error('AuthContext: Failed to parse stored user:', err);
        localStorage.removeItem('user');
      }
    }
=======
        console.error('AuthContext: CRITICAL - Failed to parse stored user:', err);
        localStorage.removeItem('user');
      }
    } else {
        console.log('AuthContext: No stored user found');
    }
    console.log('AuthContext: Finalizing initialization (setting loading to false)');
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const userData = await authService.login({ email, password });
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const userData = await authService.register({ name, email, password });
    setUser(userData);
    return userData;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
