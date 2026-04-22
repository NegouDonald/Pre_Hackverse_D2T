import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Calendar } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { toast } from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('student@gmail.com');
    const [password, setPassword] = useState('password123');
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });
            toast.success('Bienvenue !');
            navigate('/');
        } catch (err) {
            toast.error('Email ou mot de passe incorrect');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-primary -z-10 rounded-b-[100px] opacity-10"></div>

            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-6 animate-float">
                        <Calendar size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">SmartTime Manager</h2>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Connecte-toi avec ton email étudiant</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        required
                                        type="email"
                                        className="input-field pl-12"
                                        placeholder="student@univ.fr"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        required
                                        type="password"
                                        className="input-field pl-12"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn btn-primary flex items-center justify-center gap-3 py-4 rounded-2xl shadow-xl shadow-primary/30 font-bold"
                        >
                            <LogIn size={20} /> Se Connecter
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Tu n'as pas de compte ?{' '}
                        <Link to="/register" className="font-bold text-primary hover:text-primary-dark transition-colors underline decoration-2 underline-offset-4">
                            S'inscrire gratuitement
                        </Link>
                    </p>
                </div>

                <div className="text-center">
                    <p className="text-xs text-slate-400">Démo: student@gmail.com / password123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
