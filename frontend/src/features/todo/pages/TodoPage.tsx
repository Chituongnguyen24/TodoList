import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, ArrowUpDown, Moon, Sun, RefreshCw, Archive } from 'lucide-react';
import { useTodos, useTodoStats, useCreateTodo, useUpdateTodo, useUpdateTodoStatus, useDeleteTodo } from '../hooks/useTodos';
import type { Todo, TodoStatus } from '../types';
import DashboardStats from '../components/DashboardStats';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';
import ConfirmModal from '../../../components/ui/ConfirmModal';

export const TodoPage: React.FC = () => {
  // Theme Dark/Light
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  // Query and Filter states
  const [searchInput, setSearchInput] = useState('');
  const [titleQuery, setTitleQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TodoStatus | undefined>(undefined);
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<number | null>(null);

  // Sync title input search with query (debounced/controlled via search submit or simple effect)
  useEffect(() => {
    const handler = setTimeout(() => {
      setTitleQuery(searchInput);
    }, 300); // 300ms debounce
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Sync Dark/Light Mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Queries
  const queryParams = {
    title: titleQuery || undefined,
    status: statusFilter,
    priority: priorityFilter === 'ALL' ? undefined : priorityFilter,
    sortBy,
    sortDir,
  };

  const { data: todos = [], isLoading, isError, refetch } = useTodos(queryParams);
  const { data: stats, isLoading: isStatsLoading } = useTodoStats();

  // Mutations
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const updateStatusMutation = useUpdateTodoStatus();
  const deleteTodoMutation = useDeleteTodo();

  // Handlers
  const handleOpenCreateModal = () => {
    setSelectedTodo(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsFormOpen(true);
  };

  const handleOpenDeleteModal = (id: number) => {
    setTodoToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (selectedTodo) {
      updateTodoMutation.mutate(
        { id: selectedTodo.id, request: data },
        {
          onSuccess: () => setIsFormOpen(false),
        }
      );
    } else {
      createTodoMutation.mutate(data, {
        onSuccess: () => setIsFormOpen(false),
      });
    }
  };

  const handleStatusChange = (id: number, status: TodoStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleConfirmDelete = () => {
    if (todoToDelete !== null) {
      deleteTodoMutation.mutate(todoToDelete);
    }
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setTitleQuery('');
    setStatusFilter(undefined);
    setPriorityFilter('ALL');
    setSortBy('createdAt');
    setSortDir('desc');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200/60 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/20">
              N
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                NotionTodo
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Manage your tasks beautifully.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer focus:outline-none"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => refetch()}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer focus:outline-none"
              title="Sync Tasks"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dashboard Stats */}
        <DashboardStats stats={stats} isLoading={isStatsLoading} />

        {/* Toolbar Controls */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search tasks by title..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Priority Filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs font-medium focus:outline-none"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              {/* Sort By Filter */}
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs font-medium focus:outline-none"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="dueDate">Due Date</option>
                  <option value="title">Title</option>
                  <option value="priority">Priority</option>
                  <option value="status">Status</option>
                </select>

                <button
                  onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 focus:outline-none transition-colors text-xs font-semibold"
                  title={`Sort direction: ${sortDir === 'asc' ? 'Ascending' : 'Descending'}`}
                >
                  {sortDir === 'asc' ? 'ASC' : 'DESC'}
                </button>
              </div>

              {/* Add Task Button */}
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 active:scale-98 text-white rounded-xl text-sm font-medium shadow-md shadow-primary-500/10 hover:shadow-lg transition-all focus:outline-none flex items-center gap-1.5 cursor-pointer ml-auto md:ml-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Status Tabs Filter */}
          <div className="flex gap-1.5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 overflow-x-auto">
            {[
              { label: 'All', value: undefined },
              { label: 'To Do', value: 'TODO' as TodoStatus },
              { label: 'In Progress', value: 'IN_PROGRESS' as TodoStatus },
              { label: 'Completed', value: 'DONE' as TodoStatus },
            ].map((tab, idx) => {
              const isActive = statusFilter === tab.value;
              return (
                <button
                  key={idx}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide cursor-pointer transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Task List */}
        {isLoading ? (
          // Skeleton loading
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-full h-[88px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 w-3/4">
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
                  <div className="space-y-2 w-full">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3 animate-pulse" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3 animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : isError ? (
          // Error State
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-xs">
            <p className="text-danger-500 font-medium mb-3">Failed to load tasks from backend.</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : todos.length === 0 ? (
          // Empty State
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
              <Archive className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">
              No tasks found
            </h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm mb-6">
              {titleQuery || priorityFilter !== 'ALL' || statusFilter
                ? 'Try adjusting your search queries or filter categories.'
                : 'Get started by creating your first Notion-style task.'}
            </p>
            {(titleQuery || priorityFilter !== 'ALL' || statusFilter) ? (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors font-semibold cursor-pointer"
              >
                Clear all filters
              </button>
            ) : (
              <button
                onClick={handleOpenCreateModal}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-500/10 hover:shadow-lg transition-all focus:outline-none flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Task</span>
              </button>
            )}
          </div>
        ) : (
          // Task Cards List
          <div className="space-y-3">
            {todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Todo Form Modal (Create / Edit) */}
      <TodoForm
        isOpen={isFormOpen}
        todo={selectedTodo}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
export default TodoPage;
