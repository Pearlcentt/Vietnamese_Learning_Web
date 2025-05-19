package group3.vietnamese_learning_web.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Lesson")
@IdClass(LessonId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {

    @Id
    private Integer lessonId;

    @Id
    private Integer topicId;

    @Enumerated(EnumType.STRING)
    private LessonType lessonType;

    @Column(columnDefinition = "TEXT")
    private String sId; // comma-separated sentence IDs

    public enum LessonType {
        Vocab, Fill_in_the_blank, Re_order_words, Re_order_chars, Listen_and_fill
    }
}
