package group3.vietnamese_learning_web.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BadgeDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private String conditionType;
    private String conditionValue;
}