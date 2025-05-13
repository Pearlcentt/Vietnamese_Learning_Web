package group3.vietnamese_learning_web.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;

    @Column(length = 5000)
    private String options;

    @Column(nullable = false)
    private String correctAnswer;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @ManyToOne
    @JoinColumn(name = "test_id")
    private Test test;

    // For audio questions
    private String audioUrl;

    public enum QuestionType {
        MULTIPLE_CHOICE,
        REORDER_CHARACTERS,
        LISTEN_AND_FILL
    }
}