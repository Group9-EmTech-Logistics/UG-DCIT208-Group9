import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../api/authApi";

export const useLogin = () => {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (username, password) => {
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(username, password);
      login(res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return { login: handleLogin, loading, error };
};
