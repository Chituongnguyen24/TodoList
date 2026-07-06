import React from 'react';
import { Calendar, AlertCircle, Edit2, Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';
import type { Todo, TodoStatus, TodoPriority } from '../types';

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TodoStatus) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const getPriorityStyles = (priority: TodoPriority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-danger-50 text-danger-600 border-danger-100 dark:bg-danger-500/10 dark:text-danger-400 dark:border-danger-500/20';
      case 'MEDIUM':
        return 'bg-warning-50 text-warning-600 border-warning-100 dark:bg-warning-500/10 dark:text-warning-400 dark:border-warning-500/20';
      case 'LOW':
        return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/80';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: TodoStatus) => {
    switch (status) {
      case 'DONE':
        return <CheckCircle2 className="w-5 h-5 text-success-500 dark:text-success-400 fill-success-50/50" />;
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-warning-500 dark:text-warning-400 animate-pulse" />;
      case 'TODO':
      default:
        return <Circle className="w-5 h-5 text-slate-400 dark:text-slate-600" />;
    }
  };

  const cycleStatus = () => {
    const nextStatusMap: Record<TodoStatus, TodoStatus> = {
      TODO: 'IN_PROGRESS',
      IN_PROGRESS: 'DONE',
      DONE: 'TODO',
    };
    onStatusChange(todo.id, nextStatusMap[todo.status]);
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== 'DONE';

  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <button
          onClick={cycleStatus}
          title="Click to cycle status (Todo -> Progress -> Done)"
          className="mt-0.5 shrink-0 focus:outline-none hover:scale-110 active:scale-95 transition-transform"
        >
          {getStatusIcon(todo.status)}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-medium text-base truncate transition-all duration-200 ${
                todo.status === 'DONE'
                  ? 'line-through text-slate-400 dark:text-slate-600'
                  : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {todo.title}
            </h3>
            <span className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full border ${getPriorityStyles(todo.priority)}`}>
              {todo.priority}
            </span>
          </div>

          {todo.description && (
            <p className={`text-sm mt-1 line-clamp-2 ${todo.status === 'DONE' ? 'text-slate-400/80 dark:text-slate-600/80' : 'text-slate-500 dark:text-slate-400'}`}>
              {todo.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-3 text-xs text-slate-400 dark:text-slate-500">
            {todo.dueDate && (
              <span
                className={`flex items-center gap-1 font-medium px-2 py-0.5 rounded-md border ${
                  todo.status === 'DONE'
                    ? 'bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800/40 dark:text-slate-500 dark:border-slate-800'
                    : isOverdue
                    ? 'bg-danger-50 text-danger-600 border-danger-100 dark:bg-danger-500/10 dark:text-danger-400 dark:border-danger-500/20'
                    : 'bg-primary-50/50 text-primary-600 border-primary-100 dark:bg-primary-500/5 dark:text-primary-400 dark:border-primary-500/10'
                }`}
              >
                {isOverdue && todo.status !== 'DONE' ? (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>
                  {formatDueDate(todo.dueDate)}
                  {isOverdue && todo.status !== 'DONE' && ' (Overdue)'}
                </span>
              </span>
            )}
            <span>Created {new Date(todo.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-4 md:mt-0 justify-end md:ml-4 shrink-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit(todo)}
          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          title="Edit Task"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 rounded-lg text-danger-500 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors focus:outline-none"
          title="Delete Task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default TodoCard;
