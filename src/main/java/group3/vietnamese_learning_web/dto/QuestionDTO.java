package group3.vietnamese_learning_web.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private Integer sId;
    private Integer type;
    private String eng;
    private String viet;

    private java.util.List<String> vietList;
    private java.util.List<String> vietSimilarWords;

    private String question;
    private String answer;
    private java.util.List<String> choices;

    private java.util.List<String> words;
    private java.util.List<String> correctOrder;

    private java.util.List<String> chars;
    private java.util.List<String> charOrder;

    private String audioUrl;
}
