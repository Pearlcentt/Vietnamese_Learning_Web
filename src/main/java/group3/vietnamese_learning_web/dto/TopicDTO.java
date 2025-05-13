package group3.vietnamese_learning_web.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicDTO {
    private Long id;
    private String name;
    private String description;
    private Integer order;
    private String difficulty;
}