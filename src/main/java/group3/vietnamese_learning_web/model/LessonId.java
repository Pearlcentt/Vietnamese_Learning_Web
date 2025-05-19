package group3.vietnamese_learning_web.model;

import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonId implements Serializable {
    private Integer lessonId;
    private Integer topicId;
}
