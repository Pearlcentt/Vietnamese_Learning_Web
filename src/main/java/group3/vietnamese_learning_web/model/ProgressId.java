package group3.vietnamese_learning_web.model;

import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressId implements Serializable {
    private Integer uId;
    private Integer topicId;
    private Integer lessonId;
}
