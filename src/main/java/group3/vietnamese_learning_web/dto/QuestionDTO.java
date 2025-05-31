package group3.vietnamese_learning_web.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private Integer sId;
    private String eng;
    private String viet;
    private List<String> words; // For fill/reorder
    private List<String> choices; // For MCQ, if needed
    private Integer answerIdx; // For fill/reorder answers
}

// vietlingo
