package group3.vietnamese_learning_web.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Word")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "w_id")
    private Integer wId;

    @Column(name = "s_id", nullable = false)
    private Integer sId;

    @Column(name = "idx", nullable = false)
    private Integer idx;

    @Column(name = "word", nullable = false)
    private String word;

    @Column(name = "similar_words", columnDefinition = "TEXT")
    private String similarWords;
}
