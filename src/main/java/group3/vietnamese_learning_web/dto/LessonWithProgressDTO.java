package group3.vietnamese_learning_web.dto;

import group3.vietnamese_learning_web.model.Lesson.LessonType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonWithProgressDTO {

    private int lessonId;
    private int topicId;
    private String lessonType; // final value stored as String
    private String status;

    // ✅ This constructor is required by the JPQL query!
    public LessonWithProgressDTO(int lessonId, int topicId, LessonType lessonType, String status) {
        this.lessonId = lessonId;
        this.topicId = topicId;
        this.lessonType = lessonType.name(); // ✅ Convert enum to string
        this.status = status;
    }
}
