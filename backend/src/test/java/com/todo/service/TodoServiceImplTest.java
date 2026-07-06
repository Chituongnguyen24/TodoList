package com.todo.service;

import com.todo.dto.request.TodoCreateRequest;
import com.todo.dto.request.TodoUpdateRequest;
import com.todo.dto.response.TodoResponse;
import com.todo.dto.response.TodoStatsResponse;
import com.todo.entity.Todo;
import com.todo.entity.TodoPriority;
import com.todo.entity.TodoStatus;
import com.todo.exception.ResourceNotFoundException;
import com.todo.mapper.TodoMapper;
import com.todo.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TodoServiceImplTest {

    @Mock
    private TodoRepository todoRepository;

    @Spy
    private TodoMapper todoMapper = new TodoMapper();

    @InjectMocks
    private TodoServiceImpl todoService;

    private Todo todo;
    private TodoCreateRequest createRequest;
    private TodoUpdateRequest updateRequest;

    @BeforeEach
    void setUp() {
        todo = Todo.builder()
                .id(1L)
                .title("Test Task")
                .description("Test Description")
                .status(TodoStatus.TODO)
                .priority(TodoPriority.MEDIUM)
                .dueDate(LocalDateTime.now().plusDays(1))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        createRequest = new TodoCreateRequest(
                "Test Task",
                "Test Description",
                TodoStatus.TODO,
                TodoPriority.MEDIUM,
                LocalDateTime.now().plusDays(1)
        );

        updateRequest = new TodoUpdateRequest(
                "Updated Task",
                "Updated Description",
                TodoStatus.IN_PROGRESS,
                TodoPriority.HIGH,
                LocalDateTime.now().plusDays(2)
        );
    }

    @Test
    void createTodo_ShouldReturnResponse() {
        when(todoRepository.save(any(Todo.class))).thenReturn(todo);

        TodoResponse response = todoService.createTodo(createRequest);

        assertNotNull(response);
        assertEquals(todo.getTitle(), response.getTitle());
        assertEquals(todo.getDescription(), response.getDescription());
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    void getTodoById_WithExistingId_ShouldReturnResponse() {
        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo));

        TodoResponse response = todoService.getTodoById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(todo.getTitle(), response.getTitle());
    }

    @Test
    void getTodoById_WithNonExistingId_ShouldThrowException() {
        when(todoRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> todoService.getTodoById(2L));
    }

    @Test
    void updateTodo_ShouldReturnUpdatedResponse() {
        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo));
        when(todoRepository.save(any(Todo.class))).thenReturn(todo);

        TodoResponse response = todoService.updateTodo(1L, updateRequest);

        assertNotNull(response);
        verify(todoRepository, times(1)).save(todo);
    }

    @Test
    void updateStatus_ShouldChangeStatus() {
        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo));
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TodoResponse response = todoService.updateStatus(1L, TodoStatus.DONE);

        assertNotNull(response);
        assertEquals(TodoStatus.DONE, response.getStatus());
        verify(todoRepository, times(1)).save(todo);
    }

    @Test
    void deleteTodo_ShouldInvokeRepositoryDelete() {
        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo));
        doNothing().when(todoRepository).delete(todo);

        assertDoesNotThrow(() -> todoService.deleteTodo(1L));

        verify(todoRepository, times(1)).delete(todo);
    }

    @Test
    void getStats_ShouldReturnCounts() {
        when(todoRepository.count()).thenReturn(10L);
        when(todoRepository.countByStatus(TodoStatus.TODO)).thenReturn(4L);
        when(todoRepository.countByStatus(TodoStatus.IN_PROGRESS)).thenReturn(3L);
        when(todoRepository.countByStatus(TodoStatus.DONE)).thenReturn(3L);

        TodoStatsResponse stats = todoService.getStats();

        assertNotNull(stats);
        assertEquals(10L, stats.getTotal());
        assertEquals(4L, stats.getTodo());
        assertEquals(3L, stats.getInProgress());
        assertEquals(3L, stats.getCompleted());
    }
}
