package group3.vietnamese_learning_web.dto;

import group3.vietnamese_learning_web.model.Question.QuestionType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private Long id;
    private String content;
    private QuestionType type;
    private String options;
    private String correctAnswer;
    private Long lessonId;
    private Long testId;
    private String audioUrl;
}