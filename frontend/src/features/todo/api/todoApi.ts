import api from '../../../services/api';
import type { Todo, TodoCreateRequest, TodoUpdateRequest, TodoStatus, TodoStats } from '../types';

export const todoApi = {
  getAllTodos: async (params?: {
    title?: string;
    status?: TodoStatus;
    priority?: string;
    sortBy?: string;
    sortDir?: string;
  }): Promise<Todo[]> => {
    const response = await api.get<Todo[]>('/todos', { params });
    return response.data;
  },

  getTodoById: async (id: number): Promise<Todo> => {
    const response = await api.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  createTodo: async (request: TodoCreateRequest): Promise<Todo> => {
    const response = await api.post<Todo>('/todos', request);
    return response.data;
  },

  updateTodo: async (id: number, request: TodoUpdateRequest): Promise<Todo> => {
    const response = await api.put<Todo>(`/todos/${id}`, request);
    return response.data;
  },

  updateTodoStatus: async (id: number, status: TodoStatus): Promise<Todo> => {
    const response = await api.patch<Todo>(`/todos/${id}/status`, { status });
    return response.data;
  },

  deleteTodo: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  getStats: async (): Promise<TodoStats> => {
    const response = await api.get<TodoStats>('/todos/stats');
    return response.data;
  },
};
export default todoApi;
