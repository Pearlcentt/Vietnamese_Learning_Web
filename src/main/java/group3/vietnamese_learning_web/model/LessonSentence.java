package group3.vietnamese_learning_web.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Lesson_Sentence")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonSentence {
    @EmbeddedId
    private LessonSentenceId id;
}
