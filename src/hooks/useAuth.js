import { useMemo, useCallback } from "react";
import { api, setToken, clearSession } from "../api/client";

export function useAuth() {
  const currentUserId = Number(localStorage.getItem("userId") || "");
  const isUserLoggedIn = Number.isFinite(currentUserId) && currentUserId > 0;

  const loginUser = useCallback(async (email, password) => {
    const response = await api("/login", {
      method: "POST",
      body: { email, password },
    });
    setToken(response.token);
    localStorage.setItem("userId", response.user.id);
    return response.user;
  }, []);

  const logoutUser = useCallback(() => {
    clearSession();
  }, []);

  return useMemo(
    () => ({ currentUserId, isUserLoggedIn, loginUser, logoutUser }),
    [currentUserId, isUserLoggedIn, loginUser, logoutUser]
  );
}
