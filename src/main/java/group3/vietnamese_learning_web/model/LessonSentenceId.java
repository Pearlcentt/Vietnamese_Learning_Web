package group3.vietnamese_learning_web.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonSentenceId implements Serializable {
    private Integer topicId;
    private Integer lessonId;
    private Integer sId;
}