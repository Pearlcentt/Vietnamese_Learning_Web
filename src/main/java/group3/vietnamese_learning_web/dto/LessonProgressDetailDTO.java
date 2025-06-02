package group3.vietnamese_learning_web.dto;

import group3.vietnamese_learning_web.model.LessonType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonProgressDetailDTO {
    private Integer topicId;
    private Integer lessonId;
    private LessonType lessonType;
    private String status;   // "Completed", "In_Progress", "Not_Started"
    private Integer score;
    private Double progressPercentage; // 0-100% based on score or completion
}
