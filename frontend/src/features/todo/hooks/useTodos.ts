import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import todoApi from '../api/todoApi';
import type { TodoCreateRequest, TodoUpdateRequest, TodoStatus } from '../types';
import toast from 'react-hot-toast';

export const useTodos = (params?: {
  title?: string;
  status?: TodoStatus;
  priority?: string;
  sortBy?: string;
  sortDir?: string;
}) => {
  return useQuery({
    queryKey: ['todos', params],
    queryFn: () => todoApi.getAllTodos(params),
  });
};

export const useTodoStats = () => {
  return useQuery({
    queryKey: ['todos', 'stats'],
    queryFn: () => todoApi.getStats(),
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: TodoCreateRequest) => todoApi.createTodo(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Task created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: TodoUpdateRequest }) =>
      todoApi.updateTodo(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Task updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update task';
      toast.error(message);
    },
  });
};

export const useUpdateTodoStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: TodoStatus }) =>
      todoApi.updateTodoStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Status updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update status';
      toast.error(message);
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => todoApi.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Task deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete task';
      toast.error(message);
    },
  });
};
