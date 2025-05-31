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
    private Integer sid;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String eng;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String viet;

    @Column(nullable = false, length = 255)
    private String topicName; // Foreign key to Topic, could be relationship if desired

    // Optional: Relationship to Words
    // @OneToMany(mappedBy = "sentence")
    // private List<Word> words;
}
