import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, trend, negative }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 transition-all shadow-sm shadow-slate-100 dark:shadow-none"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    {icon}
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-bold ${negative ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
                    {trend}
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
            </div>
        </motion.div>
    );
};

export default StatCard;
