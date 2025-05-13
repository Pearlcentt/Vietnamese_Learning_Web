package group3.vietnamese_learning_web.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProgressDTO {
    private Long id;
    private Long studentId;
    private Long lessonId;
    private Long topicId;
    private Double scorePercentage;
    private LocalDateTime lastAttemptDate;
    private Boolean completed;
}