package com.todo.config;

import com.todo.entity.Todo;
import com.todo.entity.TodoPriority;
import com.todo.entity.TodoStatus;
import com.todo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SeedDataConfig implements CommandLineRunner {

    private final TodoRepository todoRepository;

    @Override
    public void run(String... args) throws Exception {
        if (todoRepository.count() == 0) {
            List<Todo> seeds = new ArrayList<>();
            LocalDateTime now = LocalDateTime.now();

            String[] titles = {
                "Learn React 19 and custom compiler hooks",
                "Implement Spring Boot 3 security configuration",
                "Deploy Todo application to Render cloud",
                "Write backend unit tests for pagination logic",
                "Refactor theme colors using Tailwind CSS v4 variables",
                "Read Clean Code chapter 3 on function design",
                "Outline database index tuning plan for MySQL",
                "Review pull request on authentication middleware",
                "Set up GitHub Actions CI/CD workflow pipeline",
                "Configure Swagger/OpenAPI details for task entities",
                "Fix CORS issues in local development ports",
                "Create Figma mockups for task board column layout",
                "Test responsive layouts on mobile Safari and Chrome",
                "Check Docker Compose container healthcheck logs",
                "Set up Elasticsearch logging pipeline for staging",
                "Write integration tests for patch status updates",
                "Refactor state caching with TanStack Query keys",
                "Prepare slide deck for spring release demo",
                "Benchmark JPA database pool size settings",
                "Analyze CSS bundle sizes in production build",
                "Optimize query index on creation date field",
                "Fix timezones offset conversion on due dates",
                "Clean up unused node modules in package.json",
                "Configure Nginx proxy headers in Dockerfile",
                "Set up dark mode global context in theme provider"
            };

            String[] descriptions = {
                "Study the new React 19 features, compiler rules, and how to use use() hook.",
                "Configure JWT validation, role-based resource access, and cors filters.",
                "Create web service for backend, set up environment variables and DB links.",
                "Add JUnit 5 mock tests for Pageable request queries and PageResponse wrapper.",
                "Migrate tailwind.config.js properties into CSS @theme variables for CSS imports.",
                "Review the guidelines on function arguments, side effects, and clean naming.",
                "Analyze explain plans on slow queries, check index usage, and add covering indexes.",
                "Verify security roles, token parsing, and user authentication database hooks.",
                "Write YAML workflow to test, build docker image, and push to container registry.",
                "Add Operation descriptions, responses schemas, and tag group annotations.",
                "Allow origins, headers, and set credentials flag on Tomcat server config.",
                "Mock cards, priority markers, dark mode colors, and dashboard stat layout.",
                "Run responsiveness testing on virtual and physical mobile viewports.",
                "Analyze db service health state, connection retries, and container restarts.",
                "Deploy Logstash and Filebeat to stream logs to central elasticsearch cluster.",
                "Ensure patching only updates status field, keeping other properties unchanged.",
                "Verify queries key invalidation on mutate triggers and cache fresh duration.",
                "Draft PowerPoint deck explaining the Spring Boot 3 fullstack architecture.",
                "Test Hikari pool sizes from 10 to 50 under simulated thread load.",
                "Run bundle analyzer plugin, clean up lodash imports, and optimize chunks.",
                "Create migration script to index created_at descending column.",
                "Add ISO-8601 formatting serialization config to Jackson ObjectMapper.",
                "Run npm prune, audit packages, and remove unused package configuration keys.",
                "Configure proxy_pass parameters, client max body limits, and headers.",
                "Configure dark variant on html tag based on active theme state."
            };

            TodoStatus[] statuses = {
                TodoStatus.TODO, TodoStatus.IN_PROGRESS, TodoStatus.DONE,
                TodoStatus.TODO, TodoStatus.IN_PROGRESS, TodoStatus.TODO,
                TodoStatus.DONE, TodoStatus.TODO, TodoStatus.IN_PROGRESS,
                TodoStatus.DONE, TodoStatus.TODO, TodoStatus.TODO,
                TodoStatus.DONE, TodoStatus.TODO, TodoStatus.IN_PROGRESS,
                TodoStatus.DONE, TodoStatus.IN_PROGRESS, TodoStatus.TODO,
                TodoStatus.DONE, TodoStatus.TODO, TodoStatus.TODO,
                TodoStatus.DONE, TodoStatus.TODO, TodoStatus.TODO,
                TodoStatus.DONE
            };

            TodoPriority[] priorities = {
                TodoPriority.HIGH, TodoPriority.MEDIUM, TodoPriority.LOW,
                TodoPriority.HIGH, TodoPriority.MEDIUM, TodoPriority.LOW,
                TodoPriority.MEDIUM, TodoPriority.HIGH, TodoPriority.HIGH,
                TodoPriority.LOW, TodoPriority.MEDIUM, TodoPriority.LOW,
                TodoPriority.HIGH, TodoPriority.LOW, TodoPriority.MEDIUM,
                TodoPriority.LOW, TodoPriority.HIGH, TodoPriority.LOW,
                TodoPriority.MEDIUM, TodoPriority.LOW, TodoPriority.MEDIUM,
                TodoPriority.LOW, TodoPriority.LOW, TodoPriority.MEDIUM,
                TodoPriority.HIGH
            };

            // Custom due dates
            LocalDateTime[] dueDates = {
                now.plusDays(2), now.plusDays(1), now.minusDays(1), // Done task can be in the past
                now.plusDays(4), now.plusDays(3), null,
                now.minusDays(2), now.plusDays(5), now.plusHours(12),
                now.minusDays(3), null, now.plusDays(7),
                now.minusDays(4), null, now.plusDays(10),
                now.minusDays(5), now.plusDays(2), null,
                now.minusDays(6), null, now.plusDays(14),
                now.minusDays(7), null, now.plusDays(20),
                now.minusDays(8)
            };

            for (int i = 0; i < titles.length; i++) {
                Todo todo = Todo.builder()
                        .title(titles[i])
                        .description(descriptions[i])
                        .status(statuses[i])
                        .priority(priorities[i])
                        .dueDate(dueDates[i])
                        .build();
                seeds.add(todo);
            }

            todoRepository.saveAll(seeds);
            System.out.println(">>> Seeded 25 tasks into Database successfully for pagination testing!");
        }
    }
}
