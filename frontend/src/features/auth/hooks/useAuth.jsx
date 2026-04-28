import { useState } from "react";
import { registerApi, loginApi } from "../services/auth.service";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);

  const register = async (data) => {
    try {
      setLoading(true);
      const res = await registerApi(data);
      return res;
    } catch (err) {
      throw err?.response?.data || err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const login = async (data) => {
    try {
      setLoading(true);
      const res = await loginApi(data);
      return res;
    } catch (err) {
      throw err?.response?.data || err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
