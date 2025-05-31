package group3.vietnamese_learning_web.model;

import lombok.*;
import jakarta.persistence.*;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonId implements Serializable {
    private Integer topicId;
    private Integer lessonId;
}
