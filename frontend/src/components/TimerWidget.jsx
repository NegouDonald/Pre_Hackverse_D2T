import React, { useState, useEffect } from 'react';
import { Play, Square, Clock } from 'lucide-react';
import useTaskStore from '../store/taskStore';

const TimerWidget = () => {
    const { activeTask, stopSession } = useTaskStore();
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval = null;
        if (activeTask) {
            interval = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        } else {
            setSeconds(0);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [activeTask]);

    const formatTime = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!activeTask) return null;

    return (
        <div className="fixed bottom-8 right-8 z-[60] animate-in slide-in-from-right-10 duration-500">
            <div className="bg-primary text-white p-4 pr-6 rounded-3xl shadow-2xl flex items-center gap-4 border-2 border-white/20 backdrop-blur-xl">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
                    <Clock size={24} />
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Session en cours</p>
                    <h4 className="font-bold text-sm truncate max-w-[150px]">{activeTask.title}</h4>
                    <p className="text-2xl font-mono font-bold leading-none">{formatTime(seconds)}</p>
                </div>
                <button
                    onClick={() => stopSession(activeTask.id)}
                    className="ml-2 w-10 h-10 bg-error rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-error/20"
                >
                    <Square size={18} fill="currentColor" />
                </button>
            </div>
        </div>
    );
};

export default TimerWidget;
