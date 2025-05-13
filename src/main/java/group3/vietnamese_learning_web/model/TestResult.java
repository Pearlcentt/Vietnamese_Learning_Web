package group3.vietnamese_learning_web.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;

    @Column(nullable = false)
    private Double score;

    private Integer correctAnswers;

    private Integer totalQuestions;

    @Column(nullable = false)
    private LocalDateTime completedAt;

    private Integer completionTimeInSeconds;

    @Column(nullable = false)
    private Boolean passed;
}