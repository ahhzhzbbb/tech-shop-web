import { useState } from "react";
import { registerApi, loginApi, logoutApi } from "../services/auth.service";
import { useAuthContext } from "../../../context/AuthContext.jsx";
import {
  clearAuthToken,
  clearStoredUser,
  extractJwtFromLoginResponse,
  setAuthToken,
} from "../../../utils/authToken";

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
      const token = extractJwtFromLoginResponse(res);
      if (token) {
        setAuthToken(token);
      }
      return res;
    } catch (err) {
      throw err?.response?.data || err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthContext();

  const logout = async () => {
    try {
      setLoading(true);
      await logoutApi();
      setUser(null);
      clearAuthToken();
      clearStoredUser();
      return true;
    } catch (err) {
      throw err?.response?.data || err;
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}
