import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Calendar } from 'lucide-react';
import api from '../api';
import { toast } from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('auth/register/', formData);
            toast.success('Compte créé ! Connecte-toi.');
            navigate('/login');
        } catch (err) {
            toast.error('Erreur lors de l\'inscription');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="absolute top-0 right-0 w-full h-1/2 bg-primary -z-10 rounded-b-[100px] opacity-10 rotate-180"></div>

            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-top-5 duration-500">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-6">
                        <Calendar size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Créer un Compte</h2>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Rejoins la communauté des étudiants productifs</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Nom d'utilisateur</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type="text"
                                    className="input-field pl-12"
                                    placeholder="votre_nom"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type="email"
                                    className="input-field pl-12"
                                    placeholder="nom@ecole.fr"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type="password"
                                    className="input-field pl-12"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn btn-primary flex items-center justify-center gap-3 py-4 rounded-2xl shadow-xl shadow-primary/30 font-bold mt-4"
                        >
                            <UserPlus size={20} /> S'inscrire
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Déjà inscrit ?{' '}
                        <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors underline decoration-2 underline-offset-4">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
