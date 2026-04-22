import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import useTaskStore from '../store/taskStore';
import { toast } from 'react-hot-toast';

const TaskModal = ({ onClose }) => {
    const { addTask } = useTaskStore();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'COURS',
        priority: 2,
        due_date: '',
        estimated_duration_minutes: 60,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addTask(formData);
            toast.success('Tâche créée !');
            onClose();
        } catch (err) {
            toast.error('Erreur lors de la création');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold dark:text-white">Nouvelle Tâche</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Titre</label>
                        <input
                            required
                            type="text"
                            className="input-field"
                            placeholder="Ex: Réviser Algèbre"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Catégorie</label>
                            <select
                                className="input-field"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="COURS">Cours</option>
                                <option value="DEVOIR">Devoir</option>
                                <option value="EXAMEN">Examen</option>
                                <option value="PROJET">Projet</option>
                                <option value="PERSONNEL">Personnel</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Priorité</label>
                            <select
                                className="input-field"
                                value={formData.priority}
                                onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                            >
                                <option value="1">Basse</option>
                                <option value="2">Moyenne</option>
                                <option value="3">Haute</option>
                                <option value="4">Urgente</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Date limite</label>
                            <input
                                type="datetime-local"
                                className="input-field text-sm"
                                value={formData.due_date}
                                onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Durée (min)</label>
                            <input
                                type="number"
                                className="input-field"
                                value={formData.estimated_duration_minutes}
                                onChange={e => setFormData({ ...formData, estimated_duration_minutes: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                        <textarea
                            rows="3"
                            className="input-field py-3"
                            placeholder="Détails de la tâche..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full btn btn-primary flex items-center justify-center gap-2 py-3 rounded-2xl shadow-xl shadow-primary/30">
                            <Save size={20} /> Créer la tâche
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
