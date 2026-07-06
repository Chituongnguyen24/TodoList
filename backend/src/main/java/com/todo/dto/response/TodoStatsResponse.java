package com.todo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoStatsResponse {
    private long total;
    private long todo;
    private long inProgress;
    private long completed;
}
