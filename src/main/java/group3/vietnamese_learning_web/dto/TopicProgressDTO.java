package group3.vietnamese_learning_web.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopicProgressDTO {
    private int topicId;
    private String topicName;
    private String description;
    private long totalLessons;
    private long completedLessons;
}
