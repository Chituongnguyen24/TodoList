package com.todo.service;

import com.todo.dto.request.TodoCreateRequest;
import com.todo.dto.request.TodoUpdateRequest;
import com.todo.dto.response.PageResponse;
import com.todo.dto.response.TodoResponse;
import com.todo.dto.response.TodoStatsResponse;
import com.todo.entity.TodoPriority;
import com.todo.entity.TodoStatus;

import java.util.List;

public interface TodoService {
    PageResponse<TodoResponse> getAllTodos(String title, TodoStatus status, TodoPriority priority, int page, int size, String sortBy, String sortDir);
    TodoResponse getTodoById(Long id);
    TodoResponse createTodo(TodoCreateRequest request);
    TodoResponse updateTodo(Long id, TodoUpdateRequest request);
    TodoResponse updateStatus(Long id, TodoStatus status);
    void deleteTodo(Long id);
    List<TodoResponse> searchTodos(String title);
    List<TodoResponse> filterTodos(TodoStatus status, TodoPriority priority);
    TodoStatsResponse getStats();
}
