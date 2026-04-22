import { create } from 'zustand';
import api from '../api';

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    fetchUser: async () => {
        try {
            const res = await api.get('auth/me/');
            set({ user: res.data, isAuthenticated: true, loading: false });
        } catch (err) {
            set({ user: null, isAuthenticated: false, loading: false });
        }
    },

    login: async (credentials) => {
        const res = await api.post('auth/login/', credentials);
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        set({ isAuthenticated: true });
        await useAuthStore.getState().fetchUser();
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
