import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearStoredAuth,
  fetchCurrentUser,
  getStoredAuth,
  loginUser,
  logoutUser,
  signupUser,
  storeAuth,
} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = getStoredAuth();

    if (!storedAuth?.token) {
      setIsLoading(false);
      return;
    }

    setToken(storedAuth.token);
    setUser(storedAuth.user || null);

    fetchCurrentUser()
      .then((response) => {
        const nextUser = response.user;
        setUser(nextUser);
        storeAuth({ token: storedAuth.token, user: nextUser });
      })
      .catch(() => {
        clearStoredAuth();
        setToken("");
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (payload) => {
    const response = await loginUser(payload);
    setToken(response.token);
    setUser(response.user);
    storeAuth({ token: response.token, user: response.user });
    return response;
  };

  const signup = async (payload) => {
    const response = await signupUser(payload);
    setToken(response.token);
    setUser(response.user);
    storeAuth({ token: response.token, user: response.user });
    return response;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore logout API failures and clear local session anyway.
    } finally {
      clearStoredAuth();
      setToken("");
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      signup,
      logout,
      setUser,
    }),
    [isLoading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
