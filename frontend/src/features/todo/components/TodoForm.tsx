import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import type { Todo, TodoStatus, TodoPriority } from '../types';

const todoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must not exceed 100 characters')
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, 'Title is required'),
  description: z.string(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z
    .string()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      const now = new Date();
      // Allow minor clock drift/latency: offset by 1 minute
      now.setMinutes(now.getMinutes() - 1);
      return date >= now;
    }, 'Due date must be in the present or future'),
});

interface TodoFormValues {
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string;
}

interface TodoFormProps {
  todo?: Todo | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  todo,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (todo) {
        // Format LocalDateTime (e.g. "2026-07-06T13:00:00") to HTML input compatible string ("2026-07-06T13:00")
        const formattedDueDate = todo.dueDate
          ? todo.dueDate.substring(0, 16)
          : '';

        reset({
          title: todo.title,
          description: todo.description || '',
          status: todo.status,
          priority: todo.priority,
          dueDate: formattedDueDate,
        });
      } else {
        reset({
          title: '',
          description: '',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: '',
        });
      }
    }
  }, [todo, isOpen, reset]);

  if (!isOpen) return null;

  const onFormSubmit = (values: TodoFormValues) => {
    // Convert empty string due date to null or format correctly
    const requestData = {
      ...values,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
    };
    onSubmit(requestData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden transform scale-100 transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-850">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {todo ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Title <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Learn Spring Boot 3"
              className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all ${
                errors.title
                  ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
              {...register('title')}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-danger-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Description
            </label>
            <textarea
              placeholder="Provide a detailed description of this task..."
              rows={3}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                {...register('status')}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Priority
              </label>
              <select
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                {...register('priority')}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Due Date
            </label>
            <input
              type="datetime-local"
              className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all ${
                errors.dueDate
                  ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
              {...register('dueDate')}
            />
            {errors.dueDate && (
              <p className="mt-1 text-xs text-danger-500">{errors.dueDate.message}</p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 rounded-lg shadow-sm shadow-primary-500/10 hover:shadow-md transition-all focus:outline-none flex items-center gap-1.5"
            >
              {isSubmitting ? 'Saving...' : todo ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TodoForm;
