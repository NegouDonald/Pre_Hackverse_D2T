import React, { useEffect, useState } from 'react';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import { Target, Zap, Clock, Calendar as CalendarIcon } from 'lucide-react';

const Analytics = () => {
    const [productivity, setProductivity] = useState([]);
    const [categories, setCategories] = useState([]);
    const [heatmap, setHeatmap] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes, heatRes] = await Promise.all([
                    api.get('analytics/productivity/'),
                    api.get('analytics/category_stats/'),
                    api.get('analytics/heatmap/'),
                ]);
                setProductivity(prodRes.data.map(d => ({
                    day: new Date(d.day).toLocaleDateString('fr-FR', { weekday: 'short' }),
                    count: d.count
                })));
                setCategories(catRes.data);
                setHeatmap(heatRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Analyses & Statistiques</h1>
                <p className="text-slate-500 dark:text-slate-400">Suis tes progrès et optimise ta routine.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Productivity Line Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 text-primary rounded-xl">
                                <Zap size={20} />
                            </div>
                            <h3 className="font-bold dark:text-white text-lg">Efficacité Hebdomadaire</h3>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={productivity}>
                                <defs>
                                    <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Category Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-success/10 text-success rounded-xl">
                                <Target size={20} />
                            </div>
                            <h3 className="font-bold dark:text-white text-lg">Focus par Catégorie</h3>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categories}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                                <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Heatmap Simulation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-info/10 text-info rounded-xl">
                        <CalendarIcon size={20} />
                    </div>
                    <h3 className="font-bold dark:text-white text-lg">Intensité de Travail (Heatmap)</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 52 }, (_, weekIdx) => (
                        <div key={weekIdx} className="flex flex-col gap-1">
                            {Array.from({ length: 7 }, (_, dayIdx) => {
                                const intensity = Math.floor(Math.random() * 5);
                                const colors = ['bg-slate-100 dark:bg-slate-800', 'bg-primary/20', 'bg-primary/40', 'bg-primary/60', 'bg-primary'];
                                return (
                                    <div
                                        key={dayIdx}
                                        className={`w-3 h-3 rounded-[2px] ${colors[intensity]} transition-transform hover:scale-150 cursor-pointer`}
                                        title={`Jour ${weekIdx * 7 + dayIdx}`}
                                    ></div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex items-center justify-end gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Moins <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map(i => (
                            <div key={i} className={`w-3 h-3 rounded-[2px] ${['bg-slate-100 dark:bg-slate-800', 'bg-primary/20', 'bg-primary/40', 'bg-primary/60', 'bg-primary'][i]}`}></div>
                        ))}
                    </div> Plus
                </div>
            </motion.div>
        </div>
    );
};

export default Analytics;
