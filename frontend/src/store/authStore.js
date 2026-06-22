import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginApi, logoutApi, getUserProfileApi, updateProfileApi, changePasswordApi } from "../features/auth/services/auth.service";
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

            fetchProfile: async () => {
                try {
                    const data = await getUserProfileApi();
                    const user = {
                        id: data?.userId,
                        username: data?.username,
                        fullName: data?.fullName,
                        phoneNumber: data?.phoneNumber,
                        address: data?.address,
                        roles: data?.roles ?? [],
                    };
                    setStoredUser(user);
                    set({ user });
                    return user;
                } catch (error) {
                    console.error('Error fetching profile:', error);
                    throw error;
                }
            },

            updateProfile: async ({ fullName, phoneNumber, address }) => {
                try {
                    await updateProfileApi({ fullName, phoneNumber, address });
                    const user = { ...get().user, fullName, phoneNumber, address };
                    setStoredUser(user);
                    set({ user });
                } catch (error) {
                    console.error('Error updating profile:', error);
                    throw error;
                }
            },

            changePassword: async ({ oldPassword, newPassword }) => {
                try {
                    await changePasswordApi({ oldPassword, newPassword });
                } catch (error) {
                    console.error('Error changing password:', error);
                    throw error;
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