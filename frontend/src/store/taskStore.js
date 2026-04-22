import { create } from 'zustand';
import api from '../api';

const useTaskStore = create((set, get) => ({
    tasks: [],
    loading: false,
    activeTask: null,

    fetchTasks: async (filters = {}) => {
        set({ loading: true });
        try {
            const res = await api.get('tasks/', { params: filters });
            const tasks = res.data.results || res.data;
            set({
                tasks,
                loading: false,
                activeTask: tasks.find(t => t.status === 'IN_PROGRESS') || null
            });
        } catch (err) {
            set({ loading: false });
        }
    },

    addTask: async (taskData) => {
        const res = await api.post('tasks/', taskData);
        set((state) => ({ tasks: [res.data, ...state.tasks] }));
    },

    updateTask: async (id, taskData) => {
        const res = await api.patch(`tasks/${id}/`, taskData);
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? res.data : t)),
            activeTask: res.data.status === 'IN_PROGRESS' ? res.data : (get().activeTask?.id === id ? null : get().activeTask)
        }));
    },

    deleteTask: async (id) => {
        await api.delete(`tasks/${id}/`);
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
            activeTask: get().activeTask?.id === id ? null : get().activeTask
        }));
    },

    startSession: async (taskId) => {
        await api.post(`tasks/${taskId}/start_session/`);
        await get().fetchTasks();
    },

    stopSession: async (taskId) => {
        await api.post(`tasks/${taskId}/stop_session/`);
        await get().fetchTasks();
    },

    autoPrioritize: async () => {
        const res = await api.post('tasks/auto_prioritize/');
        set({ tasks: res.data });
    },
}));

export default useTaskStore;
