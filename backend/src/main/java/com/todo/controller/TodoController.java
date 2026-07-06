package com.todo.controller;

import com.todo.dto.request.TodoCreateRequest;
import com.todo.dto.request.TodoStatusUpdateRequest;
import com.todo.dto.request.TodoUpdateRequest;
import com.todo.dto.response.PageResponse;
import com.todo.dto.response.TodoResponse;
import com.todo.dto.response.TodoStatsResponse;
import com.todo.entity.TodoPriority;
import com.todo.entity.TodoStatus;
import com.todo.service.TodoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todos")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@Tag(name = "Todo Management", description = "APIs for managing Todos")
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    @Operation(summary = "Get list of todos with search, filter, and sorting (paginated)")
    public ResponseEntity<PageResponse<TodoResponse>> getAllTodos(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) TodoStatus status,
            @RequestParam(required = false) TodoPriority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(todoService.getAllTodos(title, status, priority, page, size, sortBy, sortDir));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get todo details by ID")
    public ResponseEntity<TodoResponse> getTodoById(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.getTodoById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new todo task")
    public ResponseEntity<TodoResponse> createTodo(@Valid @RequestBody TodoCreateRequest request) {
        TodoResponse created = todoService.createTodo(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a todo task details")
    public ResponseEntity<TodoResponse> updateTodo(
            @PathVariable Long id,
            @Valid @RequestBody TodoUpdateRequest request) {
        return ResponseEntity.ok(todoService.updateTodo(id, request));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Partially update a todo task status")
    public ResponseEntity<TodoResponse> updateTodoStatus(
            @PathVariable Long id,
            @Valid @RequestBody TodoStatusUpdateRequest request) {
        return ResponseEntity.ok(todoService.updateStatus(id, request.getStatus()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a todo task")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search todos by title (returns up to first 100 results)")
    public ResponseEntity<List<TodoResponse>> searchTodos(@RequestParam("q") String query) {
        return ResponseEntity.ok(todoService.searchTodos(query));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter todos by status and/or priority (returns up to first 100 results)")
    public ResponseEntity<List<TodoResponse>> filterTodos(
            @RequestParam(required = false) TodoStatus status,
            @RequestParam(required = false) TodoPriority priority) {
        return ResponseEntity.ok(todoService.filterTodos(status, priority));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard summary statistics")
    public ResponseEntity<TodoStatsResponse> getStats() {
        return ResponseEntity.ok(todoService.getStats());
    }
}
