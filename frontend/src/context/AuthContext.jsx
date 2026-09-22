import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // { _id, fullName, email, role }
  const [loading, setLoading] = useState(true);

  // Check existing session on load
  const checkAuth = async () => {
    setLoading(true);
    try {
      // First try user session
      const userRes = await API.get("/auth/user/me");
      if (userRes.data?.user) {
        setCurrentUser(userRes.data.user);
        setLoading(false);
        return;
      }
    } catch {
      // Ignore user auth check error, try food partner session next
    }

    try {
      const partnerRes = await API.get("/auth/food-partner/me");
      if (partnerRes.data?.foodPartner) {
        setCurrentUser(partnerRes.data.foodPartner);
        setLoading(false);
        return;
      }
    } catch {
      // No active partner session
    }

    setCurrentUser(null);
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const loginUser = async (email, password) => {
    const res = await API.post("/auth/user/login", { email, password });
    if (res.data?.user) {
      setCurrentUser(res.data.user);
    }
    return res.data;
  };

  const registerUser = async (fullName, email, password) => {
    const res = await API.post("/auth/user/register", { fullName, email, password });
    if (res.data?.user) {
      setCurrentUser(res.data.user);
    }
    return res.data;
  };

  const loginFoodPartner = async (email, password) => {
    const res = await API.post("/auth/food-partner/login", { email, password });
    if (res.data?.foodPartner) {
      setCurrentUser(res.data.foodPartner);
    }
    return res.data;
  };

  const registerFoodPartner = async (fullName, email, password) => {
    const res = await API.post("/auth/food-partner/register", {
      fullName,
      email,
      password,
    });
    if (res.data?.foodPartner) {
      setCurrentUser(res.data.foodPartner);
    }
    return res.data;
  };

  const logout = async () => {
    if (currentUser?.role === "foodpartner") {
      await API.get("/auth/food-partner/logout");
    } else {
      await API.get("/auth/user/logout");
    }
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        loginUser,
        registerUser,
        loginFoodPartner,
        registerFoodPartner,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
