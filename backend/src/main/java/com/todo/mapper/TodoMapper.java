package com.todo.mapper;

import com.todo.dto.request.TodoCreateRequest;
import com.todo.dto.request.TodoUpdateRequest;
import com.todo.dto.response.TodoResponse;
import com.todo.entity.Todo;
import com.todo.entity.TodoPriority;
import com.todo.entity.TodoStatus;
import org.springframework.stereotype.Component;

@Component
public class TodoMapper {

    public Todo toEntity(TodoCreateRequest request) {
        if (request == null) {
            return null;
        }
        return Todo.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TodoStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : TodoPriority.MEDIUM)
                .dueDate(request.getDueDate())
                .build();
    }

    public TodoResponse toResponse(Todo entity) {
        if (entity == null) {
            return null;
        }
        return TodoResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .priority(entity.getPriority())
                .dueDate(entity.getDueDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntity(Todo entity, TodoUpdateRequest request) {
        if (request == null || entity == null) {
            return;
        }
        entity.setTitle(request.getTitle());
        entity.setDescription(request.getDescription());
        entity.setStatus(request.getStatus());
        entity.setPriority(request.getPriority());
        entity.setDueDate(request.getDueDate());
    }
}
