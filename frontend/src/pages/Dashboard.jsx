import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Clock, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';
import api from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import StatCard from '../components/StatCard';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [suggestions, setSuggestions] = useState(null);
    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, suggRes, catRes] = await Promise.all([
                    api.get('analytics/dashboard/'),
                    api.get('tasks/suggestions/'),
                    api.get('analytics/category_stats/'),
                ]);
                setStats(statsRes.data);
                setSuggestions(suggRes.data);

                const formattedCat = catRes.data.map(item => ({
                    name: item.category,
                    value: item.count
                }));
                setCategoryData(formattedCat);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const COLORS = ['#6366F1', '#22C55E', '#EF4444', '#F97316', '#EAB308'];

    if (!stats) return <div className="text-center py-20">Chargement...</div>;

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Tableau de Bord</h1>
                    <p className="text-slate-500 dark:text-slate-400">Ravi de te revoir ! Voici où tu en es aujourd'hui.</p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="px-4 text-center border-r border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Productivité</p>
                        <p className="text-xl font-bold text-primary">{stats.completion_rate}%</p>
                    </div>
                    <div className="px-4 text-center">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Focus</p>
                        <p className="text-xl font-bold text-success">{stats.time_spent_today_minutes}m</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Tâches du jour" value={stats.due_today} icon={<Clock className="text-primary" />} trend="+2" />
                <StatCard title="Terminées" value={stats.completed_tasks} icon={<CheckCircle className="text-success" />} trend={`${stats.completion_rate}%`} />
                <StatCard title="En retard" value={suggestions?.overdue_alerts?.length || 0} icon={<AlertCircle className="text-error" />} negative />
                <StatCard title="Total" value={stats.total_tasks} icon={<TrendingUp className="text-info" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Suggestion IA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {suggestions?.focus_task && (
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">Focus Prioritaire</span>
                                </div>
                                <h2 className="text-4xl font-bold mb-4">{suggestions.focus_task.title}</h2>
                                <div className="flex flex-wrap items-center gap-6 mb-8 text-white/80">
                                    <div className="flex items-center gap-2">
                                        <Clock size={18} />
                                        <span>Est. {suggestions.focus_task.estimated_duration_display}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={18} />
                                        <span>Score IA: {suggestions.focus_task.auto_priority_score}</span>
                                    </div>
                                </div>
                                <button className="flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-lg shadow-black/10 active:scale-95 group">
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                        <Play size={16} fill="currentColor" />
                                    </div>
                                    Démarrer la session
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-info/10 text-info rounded-xl">
                                    <Lightbulb size={20} />
                                </div>
                                <h3 className="font-bold dark:text-white">Conseil du Moment</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 italic">"{suggestions?.tip}"</p>
                        </div>

                        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-success/10 text-success rounded-xl">
                                    <TrendingUp size={20} />
                                </div>
                                <h3 className="font-bold dark:text-white">Quick Wins</h3>
                            </div>
                            <ul className="space-y-3">
                                {suggestions?.quick_wins?.map(task => (
                                    <li key={task.id} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <span className="w-2 h-2 rounded-full bg-success"></span>
                                        {task.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Charts */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold dark:text-white mb-6">Répartition par Catégorie</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {categoryData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    {entry.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
