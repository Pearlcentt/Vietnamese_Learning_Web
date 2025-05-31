package group3.vietnamese_learning_web.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Lesson")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {
    @EmbeddedId
    private LessonId id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LessonType lessonType;

    // Optional: Fetch topic data in code if needed
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "topic_id", insertable = false, updatable = false)
    // private Topic topic;
}
