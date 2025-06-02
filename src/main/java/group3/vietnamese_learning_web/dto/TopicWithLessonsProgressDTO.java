package group3.vietnamese_learning_web.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicWithLessonsProgressDTO {
    private Integer topicId;
    private String topicName;
    private String description;
    private Integer completedLessons;
    private Integer totalLessons;
    private Double progressPercentage; // Overall topic progress percentage
    private List<LessonProgressDetailDTO> lessons;
}
