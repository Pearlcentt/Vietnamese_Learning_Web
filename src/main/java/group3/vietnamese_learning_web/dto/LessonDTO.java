package group3.vietnamese_learning_web.dto;

import group3.vietnamese_learning_web.model.LessonType;
import group3.vietnamese_learning_web.model.ProgressStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonDTO {
    private Integer topicId;
    private Integer lessonId;
    private LessonType lessonType;
}
