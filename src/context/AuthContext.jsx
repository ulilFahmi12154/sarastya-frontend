import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/authApi";
import {
  setUnauthorizedHandler,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from "../api/client";

const AuthContext = createContext(null);

function readStoredUser() {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(readStoredUser);

  const saveSession = useCallback((authData) => {
    const nextUser = {
      userId: authData.userId,
      email: authData.email,
    };

    localStorage.setItem(TOKEN_STORAGE_KEY, authData.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setToken(authData.token);
    setUser(nextUser);
  }, []);

  const logout = useCallback(
    (redirect = true) => {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      setToken(null);
      setUser(null);

      if (redirect) {
        navigate("/login", { replace: true });
      }
    },
    [navigate]
  );

  const login = useCallback(
    async (credentials) => {
      const authData = await loginUser(credentials);
      saveSession(authData);
      return authData;
    },
    [saveSession]
  );

  const register = useCallback(
    async (credentials) => {
      const authData = await registerUser(credentials);
      saveSession(authData);
      return authData;
    },
    [saveSession]
  );

  useEffect(() => {
    setUnauthorizedHandler(() => logout(true));

    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
