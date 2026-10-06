import { useState, useEffect, useCallback } from 'react';
import { defaultAuthRepository } from '../../data/repositories/authRepository';

export function useAuth(authRepo = defaultAuthRepository) {
  const [user, setUser] = useState(() => authRepo.getSavedUser());
  const [token, setToken] = useState(() => authRepo.getSavedToken());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Sync with API on mount if token exists
  useEffect(() => {
    if (token && !token.startsWith('mock_') && !token.startsWith('demo_')) {
      authRepo.getMe().then((freshUser) => {
        if (freshUser) setUser(freshUser);
      }).catch(() => { });
    }
  }, [token, authRepo]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authRepo.login({ email, password });
      setUser(res.user);
      setToken(res.token);
      setSuccessMessage('¡Bienvenido de vuelta, profesor!');
      return res;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [authRepo]);

  const register = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authRepo.register(data);
      setUser(res.user);
      setToken(res.token);
      setSuccessMessage('¡Cuenta de instructor creada exitosamente!');
      return res;
    } catch (err) {
      setError(err.message || 'Error al registrar la cuenta.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [authRepo]);

  const updateProfile = useCallback(async (profileData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await authRepo.updateProfile(profileData);
      setUser(updated);
      setSuccessMessage('Perfil actualizado correctamente.');
      return updated;
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [authRepo]);

  const updatePassword = useCallback(async (passwordData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authRepo.updatePassword(passwordData);
      setSuccessMessage('Contraseña cambiada con éxito.');
      return res;
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [authRepo]);

  const logout = useCallback(() => {
    // Cierre de sesión instantáneo (0ms de latencia en la interfaz de usuario)
    setUser(null);
    setToken(null);
    setIsLoading(false);

    // Limpieza de sesión y notificación en segundo plano al backend (fire-and-forget)
    try {
      authRepo.logout().catch(() => { });
    } catch (e) { }
  }, [authRepo]);

  const switchRole = useCallback((targetRole) => {
    const isDir = targetRole === 'director';
    const updated = isDir ? {
      id: 99,
      uid: 'usr_director_01',
      name: 'MWComenius',
      nombre: 'MWComenius',
      apellidos: '',
      email: 'mwcomenius@gmail.com',
      role: 'director',
      isDirector: true,
      roles: ['director', 'super-admin'],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160',
    } : {
      id: 1,
      uid: 'usr_teacher_01',
      name: 'Víctor Atala Lagunas',
      nombre: 'Víctor',
      apellidos: 'Atala Lagunas',
      email: 'instructor@masteracademy.mx',
      role: 'instructor',
      isDirector: false,
      roles: ['instructor'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160',
    };
    authRepo.saveSession(updated, token || 'demo_token_master_academy');
    setUser(updated);
  }, [authRepo, token]);

  const clearFeedback = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    error,
    successMessage,
    login,
    register,
    updateProfile,
    updatePassword,
    logout,
    switchRole,
    clearFeedback,
  };
}
