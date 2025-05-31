package group3.vietnamese_learning_web.dto;

import group3.vietnamese_learning_web.model.LessonType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonWithProgressDTO {
    private Integer topicId;
    private Integer lessonId;
    private LessonType lessonType;
    private String status;   // e.g. "Completed", "In Progress", "Not Started"
    private Integer score;
}
