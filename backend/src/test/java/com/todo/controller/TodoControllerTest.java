package com.todo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todo.dto.request.TodoCreateRequest;
import com.todo.dto.request.TodoStatusUpdateRequest;
import com.todo.dto.response.PageResponse;
import com.todo.dto.response.TodoResponse;
import com.todo.entity.TodoPriority;
import com.todo.entity.TodoStatus;
import com.todo.service.TodoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TodoController.class)
class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TodoService todoService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllTodos_ShouldReturnPaginatedList() throws Exception {
        TodoResponse todoResponse = TodoResponse.builder()
                .id(1L)
                .title("Test Task")
                .description("Test Description")
                .status(TodoStatus.TODO)
                .priority(TodoPriority.MEDIUM)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        PageResponse<TodoResponse> pageResponse = PageResponse.<TodoResponse>builder()
                .content(Collections.singletonList(todoResponse))
                .page(0)
                .size(10)
                .totalElements(1)
                .totalPages(1)
                .last(true)
                .build();

        when(todoService.getAllTodos(any(), any(), any(), anyInt(), anyInt(), anyString(), anyString()))
                .thenReturn(pageResponse);

        mockMvc.perform(get("/todos")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[0].title").value("Test Task"))
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.totalPages").value(1));
    }

    @Test
    void createTodo_ShouldReturnCreatedTodo() throws Exception {
        TodoCreateRequest request = new TodoCreateRequest();
        request.setTitle("New Task");
        request.setDescription("New Description");
        request.setStatus(TodoStatus.TODO);
        request.setPriority(TodoPriority.HIGH);

        TodoResponse todoResponse = TodoResponse.builder()
                .id(1L)
                .title("New Task")
                .description("New Description")
                .status(TodoStatus.TODO)
                .priority(TodoPriority.HIGH)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(todoService.createTodo(any(TodoCreateRequest.class))).thenReturn(todoResponse);

        mockMvc.perform(post("/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("New Task"))
                .andExpect(jsonPath("$.priority").value("HIGH"));
    }

    @Test
    void createTodo_WhenTitleIsEmpty_ShouldReturnBadRequest() throws Exception {
        TodoCreateRequest request = new TodoCreateRequest();
        request.setTitle(""); // Invalid title
        request.setDescription("Description");

        mockMvc.perform(post("/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Title is required"));
    }

    @Test
    void updateTodoStatus_ShouldReturnUpdatedTodo() throws Exception {
        TodoStatusUpdateRequest statusRequest = new TodoStatusUpdateRequest();
        statusRequest.setStatus(TodoStatus.DONE);

        TodoResponse updatedTodo = TodoResponse.builder()
                .id(1L)
                .title("Task Title")
                .status(TodoStatus.DONE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(todoService.updateStatus(eq(1L), eq(TodoStatus.DONE))).thenReturn(updatedTodo);

        mockMvc.perform(patch("/todos/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.status").value("DONE"));
    }
}
