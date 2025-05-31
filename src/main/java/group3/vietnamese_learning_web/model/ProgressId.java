package group3.vietnamese_learning_web.model;

import lombok.*;
import jakarta.persistence.*;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressId implements Serializable {
    @Column(name = "u_id")
    private Integer uid;

    @Column(name = "topic_id")
    private Integer topicId;

    @Column(name = "lesson_id")
    private Integer lessonId;
}
