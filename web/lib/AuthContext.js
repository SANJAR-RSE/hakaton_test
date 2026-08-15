"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiFetch, clearSession, getToken, getUser, setToken, setUser } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = getToken();
    const u = getUser();
    setTokenState(t);
    setUserState(u);
    setLoading(false);
  }, []);

  const login = useCallback(async (phone, password) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: { phone, password },
      auth: false,
    });
    setToken(data.token);
    setUser(data.user);
    setTokenState(data.token);
    setUserState(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, phone, password) => {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: { name, phone, password },
      auth: false,
    });
    setToken(data.token);
    setUser(data.user);
    setTokenState(data.token);
    setUserState(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setTokenState(null);
    setUserState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth AuthProvider ichida ishlatilishi kerak");
  }
  return ctx;
}
