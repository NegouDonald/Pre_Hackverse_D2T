import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Tag, Play } from 'lucide-react';
import api from '../api';
import useTaskStore from '../store/taskStore';

const TaskCard = ({ task }) => {
    const { fetchTasks } = useTaskStore();

    const startSession = async () => {
        try {
            await api.post(`tasks/${task.id}/start_session/`);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const priorityColors = {
        4: 'bg-error/10 text-error border-error/20',
        3: 'bg-warning/10 text-warning border-warning/20',
        2: 'bg-info/10 text-info border-info/20',
        1: 'bg-slate-100 text-slate-500 border-slate-200',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
        >
            <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${priorityColors[task.priority]}`}>
                    {task.priority === 4 ? 'Urgent' : task.priority === 3 ? 'Haute' : task.priority === 2 ? 'Moyenne' : 'Basse'}
                </span>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-primary">{task.auto_priority_score}</span>
                </div>
            </div>

            <h4 className="font-bold text-slate-800 dark:text-white mb-2 leading-tight">
                {task.title}
            </h4>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                {task.description || "Aucune description fournie."}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
                {task.tags?.map(tag => (
                    <span key={tag.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: `${tag.color}15`, color: tag.color }}>
                        <Tag size={8} /> {tag.name}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span className="text-[10px]">{task.estimated_duration_display ? `${task.estimated_duration_display}m` : '30m'}</span>
                    </div>
                    {task.due_date && (
                        <div className="flex items-center gap-1 text-error/80">
                            <Calendar size={12} />
                            <span className="text-[10px] font-bold">{new Date(task.due_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                        </div>
                    )}
                </div>

                {task.status !== 'DONE' && (
                    <button
                        onClick={startSession}
                        className="p-2 bg-primary text-white rounded-xl hover:scale-110 active:scale-95 transition-all"
                    >
                        <Play size={14} fill="currentColor" />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default TaskCard;
