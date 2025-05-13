package group3.vietnamese_learning_web.dto;

import lombok.*;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestDTO {
    private Long id;
    private String name;
    private String description;
    private Double passingThreshold;
    private Set<QuestionDTO> questions;
    private Long topicId;
}