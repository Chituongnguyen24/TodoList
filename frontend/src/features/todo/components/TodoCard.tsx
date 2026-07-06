import React, { useState } from 'react';
import { Calendar, AlertCircle, Edit2, Trash2, CheckCircle2, Circle, ChevronDown } from 'lucide-react';
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
  const [showDropdown, setShowDropdown] = useState(false);

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

  const getStatusBadgeStyles = (status: TodoStatus) => {
    switch (status) {
      case 'DONE':
        return 'bg-success-50 text-success-700 border-success-100 dark:bg-success-500/10 dark:text-success-400 dark:border-success-500/20';
      case 'IN_PROGRESS':
        return 'bg-warning-50 text-warning-750 border-warning-100 dark:bg-warning-500/10 dark:text-warning-400 dark:border-warning-500/20';
      case 'TODO':
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-800';
    }
  };

  const getStatusDotColor = (status: TodoStatus) => {
    switch (status) {
      case 'DONE':
        return 'bg-success-500';
      case 'IN_PROGRESS':
        return 'bg-warning-500 animate-pulse';
      case 'TODO':
      default:
        return 'bg-slate-400 dark:bg-slate-500';
    }
  };

  const toggleComplete = () => {
    if (todo.status === 'DONE') {
      onStatusChange(todo.id, 'TODO');
    } else {
      onStatusChange(todo.id, 'DONE');
    }
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
        
        {/* Toggle Checkbox Circle */}
        <button
          onClick={toggleComplete}
          title={todo.status === 'DONE' ? 'Mark as incomplete' : 'Mark as completed'}
          className="mt-0.5 shrink-0 focus:outline-none hover:scale-110 active:scale-95 transition-transform cursor-pointer"
        >
          {todo.status === 'DONE' ? (
            <CheckCircle2 className="w-5 h-5 text-success-500 dark:text-success-400 fill-success-50/50" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 dark:text-slate-700 hover:text-primary-500 dark:hover:text-primary-400 transition-colors" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-medium text-base truncate transition-all duration-200 ${
                todo.status === 'DONE'
                  ? 'line-through text-slate-400 dark:text-slate-650'
                  : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {todo.title}
            </h3>

            {/* Notion-style Status Dropdown Badge */}
            <div className="relative inline-block text-left shrink-0">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1.5 border cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:border-slate-350 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs active:scale-98 transition-all duration-150 ${getStatusBadgeStyles(todo.status)}`}
                title="Click to change status"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(todo.status)}`} />
                <span>{todo.status === 'TODO' ? 'To Do' : todo.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
              </button>
              
              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowDropdown(false)} />
                  <div className="absolute left-0 mt-1 w-36 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md py-1 z-40 focus:outline-none text-[11px] animate-fade-in-up">
                    {[
                      { value: 'TODO', label: 'To Do', dot: 'bg-slate-400 dark:bg-slate-500' },
                      { value: 'IN_PROGRESS', label: 'In Progress', dot: 'bg-warning-500 animate-pulse' },
                      { value: 'DONE', label: 'Completed', dot: 'bg-success-500' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onStatusChange(todo.id, option.value as TodoStatus);
                          setShowDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/60 font-semibold cursor-pointer ${
                          todo.status === option.value ? 'bg-slate-50 dark:bg-slate-800/40 text-primary-600 dark:text-primary-400 font-bold' : ''
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${option.dot}`} />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Priority Badge */}
            <span className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md border shrink-0 ${getPriorityStyles(todo.priority)}`}>
              {todo.priority}
            </span>
          </div>

          {todo.description && (
            <p className={`text-sm mt-1 line-clamp-2 ${todo.status === 'DONE' ? 'text-slate-450 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>
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
          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
          title="Edit Task"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 rounded-lg text-danger-500 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors focus:outline-none cursor-pointer"
          title="Delete Task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default TodoCard;
