import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginApi, logoutApi } from "../features/auth/services/auth.service";
import {
    extractJwtFromLoginResponse,
    setAuthToken,
    clearAuthToken,
    setStoredUser,
    clearStoredUser,
} from "../utils/authToken";

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            loading: false,
            loggedIn: false,

            setUser: (user, token) => {
                if (token) {
                    setAuthToken(token);
                }
                if (user) {
                    setStoredUser(user);
                }
                set({ user, token, loggedIn: !!user });
            },

            clearUser: () => {
                clearAuthToken();
                clearStoredUser();
                set({ user: null, token: null, loggedIn: false });
            },

            login: async (credentials) => {
                set({ loading: true });
                try {
                    const response = await loginApi(credentials);
                    const token = extractJwtFromLoginResponse(response);
                    const user = {
                        id: response?.userId,
                        username: response?.username,
                        fullName: response?.fullName,
                        phoneNumber: response?.phoneNumber,
                        address: response?.address,
                        roles: response?.roles ?? [],
                    };

                    if (token) {
                        setAuthToken(token);
                    }

                    setStoredUser(user);
                    set({ user, token, loggedIn: true });
                    return response;
                } finally {
                    set({ loading: false });
                }
            },

            logout: async () => {
                set({ loading: true });
                try {
                    await logoutApi();
                    get().clearUser();
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: "auth_store",
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                loggedIn: state.loggedIn,
            }),
        }
    )
);

export default useAuthStore;