package com.todo.service;

import com.todo.dto.request.TodoCreateRequest;
import com.todo.dto.request.TodoUpdateRequest;
import com.todo.dto.response.PageResponse;
import com.todo.dto.response.TodoResponse;
import com.todo.dto.response.TodoStatsResponse;
import com.todo.entity.Todo;
import com.todo.entity.TodoPriority;
import com.todo.entity.TodoStatus;
import com.todo.exception.ResourceNotFoundException;
import com.todo.mapper.TodoMapper;
import com.todo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;
    private final TodoMapper todoMapper;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<TodoResponse> getAllTodos(String title, TodoStatus status, TodoPriority priority, int page, int size, String sortBy, String sortDir) {
        Sort.Direction direction = Sort.Direction.DESC;
        if (sortDir != null && sortDir.equalsIgnoreCase("asc")) {
            direction = Sort.Direction.ASC;
        }

        String sortProperty = "createdAt";
        if (sortBy != null) {
            if (sortBy.equalsIgnoreCase("title")) {
                sortProperty = "title";
            } else if (sortBy.equalsIgnoreCase("dueDate")) {
                sortProperty = "dueDate";
            } else if (sortBy.equalsIgnoreCase("status")) {
                sortProperty = "status";
            } else if (sortBy.equalsIgnoreCase("priority")) {
                sortProperty = "priority";
            }
        }

        Sort sort = Sort.by(direction, sortProperty);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Todo> todoPage = todoRepository.searchAndFilter(title, status, priority, pageable);
        
        List<TodoResponse> content = todoPage.getContent().stream()
                .map(todoMapper::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<TodoResponse>builder()
                .content(content)
                .page(todoPage.getNumber())
                .size(todoPage.getSize())
                .totalElements(todoPage.getTotalElements())
                .totalPages(todoPage.getTotalPages())
                .last(todoPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public TodoResponse getTodoById(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        return todoMapper.toResponse(todo);
    }

    @Override
    @Transactional
    public TodoResponse createTodo(TodoCreateRequest request) {
        Todo todo = todoMapper.toEntity(request);
        Todo savedTodo = todoRepository.save(todo);
        return todoMapper.toResponse(savedTodo);
    }

    @Override
    @Transactional
    public TodoResponse updateTodo(Long id, TodoUpdateRequest request) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        
        todoMapper.updateEntity(todo, request);
        Todo updatedTodo = todoRepository.save(todo);
        return todoMapper.toResponse(updatedTodo);
    }

    @Override
    @Transactional
    public TodoResponse updateStatus(Long id, TodoStatus status) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        
        todo.setStatus(status);
        Todo updatedTodo = todoRepository.save(todo);
        return todoMapper.toResponse(updatedTodo);
    }

    @Override
    @Transactional
    public void deleteTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        todoRepository.delete(todo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TodoResponse> searchTodos(String title) {
        // Return first 100 search results for direct simple searches if needed, or paginate
        return getAllTodos(title, null, null, 0, 100, "createdAt", "desc").getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TodoResponse> filterTodos(TodoStatus status, TodoPriority priority) {
        // Return first 100 filter results for direct simple filters, or paginate
        return getAllTodos(null, status, priority, 0, 100, "createdAt", "desc").getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public TodoStatsResponse getStats() {
        long total = todoRepository.count();
        long todo = todoRepository.countByStatus(TodoStatus.TODO);
        long inProgress = todoRepository.countByStatus(TodoStatus.IN_PROGRESS);
        long completed = todoRepository.countByStatus(TodoStatus.DONE);

        return TodoStatsResponse.builder()
                .total(total)
                .todo(todo)
                .inProgress(inProgress)
                .completed(completed)
                .build();
    }
}
