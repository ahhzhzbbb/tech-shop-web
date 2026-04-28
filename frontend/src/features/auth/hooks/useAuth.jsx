import { useState } from "react";
<<<<<<< HEAD
import { registerApi, loginApi, logoutApi } from "../services/auth.service";
import { useAuthContext } from "../../../context/AuthContext.jsx";
=======
import { registerApi, loginApi } from "../services/auth.service";
>>>>>>> 087dbf7 (sua UI header)

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

<<<<<<< HEAD
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
            // Xóa token từ localStorage nếu có
            localStorage.removeItem('token');
            return true;
        } catch (err) {
            throw err?.response?.data || err;
        } finally {
            setLoading(false);
        }
    };

    return { logout, loading };
}
=======
  return { login, loading };
};
>>>>>>> 087dbf7 (sua UI header)
