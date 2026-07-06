package com.todo.repository;

import com.todo.entity.Todo;
import com.todo.entity.TodoPriority;
import com.todo.entity.TodoStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    List<Todo> findByTitleContainingIgnoreCase(String title);

    List<Todo> findByStatus(TodoStatus status);

    List<Todo> findByPriority(TodoPriority priority);

    List<Todo> findByStatusAndPriority(TodoStatus status, TodoPriority priority);

    // Advanced search & filter combination with pagination & sorting support
    @Query("SELECT t FROM Todo t WHERE " +
           "(:title IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority)")
    Page<Todo> searchAndFilter(
            @Param("title") String title,
            @Param("status") TodoStatus status,
            @Param("priority") TodoPriority priority,
            Pageable pageable);

    long countByStatus(TodoStatus status);
}
