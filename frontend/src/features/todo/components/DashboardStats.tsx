import React from 'react';
import { ClipboardList, Loader2, CheckCircle2, Clock } from 'lucide-react';
import type { TodoStats } from '../types';

interface DashboardStatsProps {
  stats?: TodoStats;
  isLoading: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, isLoading }) => {
  const data = [
    {
      title: 'Total Tasks',
      value: stats?.total ?? 0,
      icon: ClipboardList,
      color: 'bg-primary-50 text-primary-600 border-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/20',
    },
    {
      title: 'To Do',
      value: stats?.todo ?? 0,
      icon: Clock,
      color: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/50',
    },
    {
      title: 'In Progress',
      value: stats?.inProgress ?? 0,
      icon: Loader2,
      color: 'bg-warning-50 text-warning-600 border-warning-100 dark:bg-warning-500/10 dark:text-warning-400 dark:border-warning-500/20',
      spin: true,
    },
    {
      title: 'Completed',
      value: stats?.completed ?? 0,
      icon: CheckCircle2,
      color: 'bg-success-50 text-success-600 border-success-100 dark:bg-success-500/10 dark:text-success-400 dark:border-success-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {data.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="flex flex-col p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.title}</span>
              <div className={`p-2 rounded-lg border ${item.color}`}>
                <Icon className={`w-4 h-4 ${item.spin && isLoading ? 'animate-spin' : ''}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              {isLoading ? (
                <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              ) : (
                <span className="text-3xl font-semibold text-slate-800 dark:text-slate-100 animate-fade-in-up">
                  {item.value}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default DashboardStats;
