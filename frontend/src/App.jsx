import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import TimerWidget from './components/TimerWidget';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Planning from './pages/Planning';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import useAuthStore from './store/authStore';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuthStore();

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return isAuthenticated ? (
        <div className="lg:pl-64 min-h-screen transition-all duration-300">
            <Navbar />
            <TimerWidget />
            <main className="p-4 lg:p-8 animate-in fade-in duration-500">
                {children}
            </main>
        </div>
    ) : <Navigate to="/login" />;
};

const App = () => {
    const { fetchUser } = useAuthStore();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchUser();
        } else {
            useAuthStore.setState({ loading: false });
        }
    }, [fetchUser]);

    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
                <Route path="/planning" element={<PrivateRoute><Planning /></PrivateRoute>} />
                <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            </Routes>
        </Router>
    );
};

export default App;
