import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("ev_token");
    const email = localStorage.getItem("ev_email");
    const role = localStorage.getItem("ev_role");

    if (token) {
      setUser({
        token,
        email,
        role,
      });
    }

    // api.js clears localStorage on a 401 (expired/invalid token) but lives
    // outside the React tree and can't call setUser directly — it dispatches
    // this event instead so context state doesn't go stale relative to
    // localStorage.
    const onAuthExpired = () => setUser(null);
    window.addEventListener("ev-auth-expired", onAuthExpired);
    return () => window.removeEventListener("ev-auth-expired", onAuthExpired);
  }, []);

  const login = (data) => {
    localStorage.setItem("ev_token", data.token);
    localStorage.setItem("ev_email", data.email);
    localStorage.setItem("ev_role", data.role);

    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("ev_token");
    localStorage.removeItem("ev_email");
    localStorage.removeItem("ev_role");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};