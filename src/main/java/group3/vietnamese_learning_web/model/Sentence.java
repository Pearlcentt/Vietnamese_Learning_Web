package group3.vietnamese_learning_web.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Sentence")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sentence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "s_id")
    private Integer sId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String eng;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String viet;

    @Column(name = "topic_name", nullable = false)
    private String topicName; // Matches Topic.topicName
}
