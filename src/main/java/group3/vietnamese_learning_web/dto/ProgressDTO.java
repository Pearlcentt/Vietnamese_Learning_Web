package group3.vietnamese_learning_web.dto;

import group3.vietnamese_learning_web.model.ProgressStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressDTO {
    private Integer uid;
    private Integer topicId;
    private Integer lessonId;
    private Integer score;
    private ProgressStatus status;
}
