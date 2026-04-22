import React, { useEffect, useState } from 'react';
import useTaskStore from '../store/taskStore';
import { Plus, LayoutGrid, List as ListIcon, Filter, Search, MoreVertical, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
    const { tasks, loading, fetchTasks, autoPrioritize } = useTaskStore();
    const [view, setView] = useState('kanban'); // 'kanban' or 'list'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        { title: 'À Faire', id: 'TODO', color: 'bg-slate-400' },
        { title: 'En Cours', id: 'IN_PROGRESS', color: 'bg-primary' },
        { title: 'Terminé', id: 'DONE', color: 'bg-success' },
    ];

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Mes Tâches</h1>
                    <p className="text-slate-500 dark:text-slate-400">Gère tes projets et révisions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => autoPrioritize()}
                        className="btn bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                    >
                        Auto-prioriser ✨
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} /> Nouvelle Tâche
                    </button>
                </div>
            </header>

            <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex-1 max-w-md flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl relative">
                    <Search size={18} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une tâche..."
                        className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setView('kanban')}
                        className={`p-2 rounded-lg transition-all ${view === 'kanban' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}
                    >
                        <ListIcon size={20} />
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'kanban' ? (
                    <motion.div
                        key="kanban"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4"
                    >
                        {columns.map(col => (
                            <div key={col.id} className="min-w-[300px] flex flex-col gap-4">
                                <div className="flex items-center gap-2 px-2">
                                    <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                                    <h3 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">
                                        {col.title} ({filteredTasks.filter(t => t.status === col.id).length})
                                    </h3>
                                </div>
                                <div className="flex flex-col gap-4 min-h-[500px] p-2 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                    {filteredTasks.filter(t => t.status === col.id).map(task => (
                                        <TaskCard key={task.id} task={task} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tâche</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priorité</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date limite</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Score IA</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredTasks.map(task => (
                                    <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-800 dark:text-white">{task.title}</p>
                                            <p className="text-xs text-slate-500 truncate max-w-xs">{task.category}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${task.status === 'DONE' ? 'bg-success/10 text-success' :
                                                    task.status === 'IN_PROGRESS' ? 'bg-primary/10 text-primary' :
                                                        'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${task.priority === 4 ? 'bg-error/10 text-error' :
                                                    task.priority === 3 ? 'bg-warning/10 text-warning' :
                                                        task.priority === 2 ? 'bg-info/10 text-info' :
                                                            'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                                }`}>
                                                P{task.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary"
                                                        style={{ width: `${task.auto_priority_score}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-800 dark:text-white">{task.auto_priority_score}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>

            {isModalOpen && <TaskModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default Tasks;
