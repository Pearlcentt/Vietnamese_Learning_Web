package group3.vietnamese_learning_web.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Word")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Word {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "w_id")
    private Integer wId;

    @Column(nullable = false)
    private Integer sid; // Foreign key to Sentence

    @Column(nullable = false)
    private Integer idx; // Order of word in sentence

    @Column(nullable = false, length = 255)
    private String viet;

    @Column(columnDefinition = "TEXT")
    private String vietSimilarWords;

    @Column(nullable = false, length = 255)
    private String eng;

    @Column(columnDefinition = "TEXT")
    private String engSimilarWords;

    // Optional: Relationship to Sentence
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "s_id", insertable = false, updatable = false)
    // private Sentence sentence;
}
