package group3.vietnamese_learning_web.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "Progress")
@IdClass(ProgressId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Progress {

    @Id
    private Integer uId;

    @Id
    private Integer topicId;

    @Id
    private Integer lessonId;

    private Integer score;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    public enum Status {
        Not_Started, In_Progress, Completed
    }
}
