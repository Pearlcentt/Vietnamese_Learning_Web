package group3.vietnamese_learning_web.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Sentence")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sentence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "s_id")
    private Integer sId;

    @Column(name = "eng", nullable = false, columnDefinition = "TEXT")
    private String eng;

    @Column(name = "viet", nullable = false, columnDefinition = "TEXT")
    private String viet;

    @Column(name = "topic_name", nullable = false)
    private String topicName;
}
