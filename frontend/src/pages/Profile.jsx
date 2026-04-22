import React, { useState } from 'react';
import useAuthStore from '../store/authStore';
import { User, Mail, Clock, Shield, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api';

const Profile = () => {
    const { user, fetchUser } = useAuthStore();
    const [formData, setFormData] = useState({
        email: user?.email || '',
        study_hours_per_day: user?.study_hours_per_day || 8.0,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('auth/me/update/', formData);
            await fetchUser();
            toast.success('Profil mis à jour !');
        } catch (err) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Mon Profil</h1>
                <p className="text-slate-500 dark:text-slate-400">Gère tes informations personnelles et tes préférences d'étude.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                    <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-3xl mx-auto mb-4 border-4 border-white dark:border-slate-800 shadow-xl">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold dark:text-white">{user?.username}</h2>
                        <p className="text-sm text-slate-500 mb-6">Étudiant</p>
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Membre depuis</p>
                            <p className="text-sm font-bold dark:text-slate-300">{new Date(user?.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                            <Shield size={20} className="text-primary" /> Informations Générales
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        className="input-field pl-12"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Heures d'étude par jour (Objectif)</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="number"
                                        step="0.5"
                                        className="input-field pl-12"
                                        value={formData.study_hours_per_day}
                                        onChange={(e) => setFormData({ ...formData, study_hours_per_day: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="flex items-center gap-2 btn btn-primary px-8 py-3 shadow-xl shadow-primary/20">
                                <Save size={18} /> Sauvegarder les modifications
                            </button>
                        </div>
                    </form>

                    <div className="p-8 bg-slate-100 dark:bg-slate-800/50 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold dark:text-white mb-2">Paramètres Avancés</h3>
                        <p className="text-sm text-slate-500 mb-6">Configure tes notifications et tes intégrations de calendrier.</p>
                        <button className="text-sm font-bold text-primary hover:underline">Accéder aux paramètres de notification →</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
