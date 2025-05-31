package group3.vietnamese_learning_web.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicProgressDTO {
    private Integer topicId;
    private String topicName;
    private String description;
    private Integer completedLessons;
    private Integer totalLessons;
}
