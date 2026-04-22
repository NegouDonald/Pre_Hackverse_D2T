import React, { useState, useEffect } from 'react';
import api from '../api';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Sparkles, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Planning = () => {
    const [slots, setSlots] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7h to 21h

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            const res = await api.get('planning/slots/');
            setSlots(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const generateAutoSchedule = async () => {
        setLoading(true);
        try {
            const res = await api.post('planning/slots/auto_schedule/');
            if (res.data.length === 0) {
                toast.error('Aucune tâche à planifier pour aujourd\'hui !');
            } else {
                setSuggestions(res.data);
                toast.success(`${res.data.length} suggestions générées !`);
            }
        } catch (err) {
            toast.error('Erreur de génération');
        } finally {
            setLoading(false);
        }
    };

    const confirmSchedule = async () => {
        setLoading(true);
        try {
            await api.post('planning/slots/bulk_create/', suggestions);
            setSuggestions([]);
            fetchSlots();
            toast.success('Planning sauvegardé !');
        } catch (err) {
            toast.error('Erreur lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    const clearSuggestions = () => setSuggestions([]);

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Planning IA</h1>
                    <p className="text-slate-500 dark:text-slate-400">Optimise ton temps avec des sessions d'étude intelligentes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <AnimatePresence mode="wait">
                        {suggestions.length > 0 ? (
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <button
                                    onClick={clearSuggestions}
                                    className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-error transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <button
                                    onClick={confirmSchedule}
                                    disabled={loading}
                                    className="btn bg-success text-white flex items-center gap-2 shadow-lg shadow-success/20 px-6"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : <Check size={20} />}
                                    Confirmer ({suggestions.length})
                                </button>
                            </motion.div>
                        ) : (
                            <motion.button
                                key="gen-btn"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                onClick={generateAutoSchedule}
                                disabled={loading}
                                className="btn bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:border-primary hover:text-primary transition-all group px-6"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                ) : <Sparkles size={20} className="group-hover:animate-pulse text-primary" />}
                                Générer Planning Auto
                            </motion.button>
                        )}
                    </AnimatePresence>
                    <button className="btn btn-primary flex items-center gap-2 shadow-lg shadow-primary/20">
                        <Plus size={20} /> Créneau
                    </button>
                </div>
            </header>

            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl shadow-slate-100 dark:shadow-none">
                <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                            <CalendarIcon size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold dark:text-white">Vue Hebdomadaire</h2>
                            <p className="text-xs text-slate-400 capitalize">{new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        {[
                            { label: 'Étude', color: 'bg-primary' },
                            { label: 'Pause', color: 'bg-success' },
                            { label: 'Cours', color: 'bg-blue-500' },
                            { label: 'Perso', color: 'bg-slate-400' }
                        ].map(type => (
                            <div key={type.label} className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <div className={`w-2.5 h-2.5 rounded-full ${type.color}`}></div>
                                {type.label}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[900px] relative">
                        {/* Header Days */}
                        <div className="grid grid-cols-[100px_repeat(7,1fr)] bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800">
                            <div className="h-16 flex items-center justify-center">
                                <span className="text-[10px] uppercase tracking-widest font-black text-slate-300">Heure</span>
                            </div>
                            {days.map((day, i) => (
                                <div key={day} className={`h-16 flex flex-col items-center justify-center border-l border-slate-100 dark:border-slate-800 ${i === (new Date().getDay() + 6) % 7 ? 'bg-primary/5' : ''}`}>
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">{day.substring(0, 3)}</span>
                                    {i === (new Date().getDay() + 6) % 7 && <div className="w-1 h-1 bg-primary rounded-full mt-1"></div>}
                                </div>
                            ))}
                        </div>

                        {/* Timeline Grid */}
                        <div className="relative" style={{ height: hours.length * 80 }}>
                            {hours.map(hour => (
                                <div key={hour} className="grid grid-cols-[100px_repeat(7,1fr)] h-20 border-b border-slate-50 dark:border-slate-800/10">
                                    <div className="flex items-start justify-center pt-2">
                                        <span className="text-[11px] font-bold text-slate-400">{hour}:00</span>
                                    </div>
                                    {days.map((_, i) => (
                                        <div key={i} className="border-l border-slate-50 dark:border-slate-800/10 relative group">
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary/[0.02] flex items-center justify-center transition-all">
                                                <Plus size={14} className="text-primary/40" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}

                            {/* Render existing slots */}
                            {slots.map(slot => {
                                const startTime = new Date(slot.start_time);
                                const day = (startTime.getDay() + 6) % 7;
                                const hour = startTime.getHours();
                                const fractionalHour = hour + (startTime.getMinutes() / 60);
                                if (fractionalHour < 7 || fractionalHour > 22) return null;

                                const startPos = (fractionalHour - 7) * 80;
                                const duration = (new Date(slot.end_time) - startTime) / (1000 * 60 * 60);
                                const height = duration * 80;

                                return (
                                    <motion.div
                                        key={slot.id}
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        style={{
                                            position: 'absolute',
                                            top: startPos + 4,
                                            left: `calc(100px + ${day} * (100% - 100px) / 7 + 6px)`,
                                            width: 'calc((100% - 100px) / 7 - 12px)',
                                            height: height - 8,
                                        }}
                                        className={`rounded-2xl p-3 text-[11px] font-bold shadow-lg shadow-black/5 overflow-hidden border-l-[6px] backdrop-blur-sm transition-transform hover:scale-[1.02] cursor-pointer ${slot.slot_type === 'STUDY' ? 'bg-primary/20 text-primary-dark border-primary' :
                                                slot.slot_type === 'BREAK' ? 'bg-success/20 text-success-dark border-success' :
                                                    slot.slot_type === 'COURSE' ? 'bg-blue-500/20 text-blue-700 border-blue-500' :
                                                        'bg-slate-200/50 text-slate-600 border-slate-400'
                                            }`}
                                    >
                                        <div className="flex flex-col h-full justify-between">
                                            <p className="line-clamp-2 leading-tight">{slot.title}</p>
                                            <span className="text-[9px] opacity-60">
                                                {startTime.getHours()}:{startTime.getMinutes().toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Render suggestions */}
                            {suggestions.map((slot, idx) => {
                                const startTime = new Date(slot.start_time);
                                const day = (startTime.getDay() + 6) % 7;
                                const hour = startTime.getHours();
                                const fractionalHour = hour + (startTime.getMinutes() / 60);
                                if (fractionalHour < 7 || fractionalHour > 22) return null;

                                const startPos = (fractionalHour - 7) * 80;
                                const duration = (new Date(slot.end_time) - startTime) / (1000 * 60 * 60);
                                const height = duration * 80;

                                return (
                                    <motion.div
                                        key={`sugg-${idx}`}
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        style={{
                                            position: 'absolute',
                                            top: startPos + 6,
                                            left: `calc(100px + ${day} * (100% - 100px) / 7 + 8px)`,
                                            width: 'calc((100% - 100px) / 7 - 16px)',
                                            height: height - 12,
                                            zIndex: 10
                                        }}
                                        className="rounded-2xl p-3 text-[11px] font-bold border-2 border-dashed border-primary/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md text-primary flex flex-col justify-between shadow-2xl"
                                    >
                                        <div>
                                            <span className="flex items-center gap-1.5 mb-1.5 text-[9px] uppercase tracking-widest font-black">
                                                <Sparkles size={10} className="animate-pulse" /> IA Suggestion
                                            </span>
                                            <p className="line-clamp-2 leading-tight">{slot.title}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[9px] opacity-60">
                                                {startTime.getHours()}:{startTime.getMinutes().toString().padStart(2, '0')}
                                            </span>
                                            <div className="bg-primary/10 px-1.5 py-0.5 rounded-lg">
                                                <Check size={10} />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Planning;
