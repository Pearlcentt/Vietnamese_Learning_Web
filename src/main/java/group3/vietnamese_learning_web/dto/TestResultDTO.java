package group3.vietnamese_learning_web.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestResultDTO {
    private Long id;
    private Long studentId;
    private Long testId;
    private Double score;
    private Integer correctAnswers;
    private Integer totalQuestions;
    private LocalDateTime completedAt;
    private Integer completionTimeInSeconds;
    private Boolean passed;
}