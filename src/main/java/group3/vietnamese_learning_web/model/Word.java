package group3.vietnamese_learning_web.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Arrays;
import java.util.List;

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

    @Column(name = "s_id", nullable = false)
    private Integer sId;

    @Column(name = "idx", nullable = false)
    private Integer idx;

    @Column(name = "viet", nullable = false)
    private String viet;

    @Column(name = "viet_similar_words")
    private String vietSimilarWords; // Comma-separated in DB

    @Column(name = "eng", nullable = false)
    private String eng;

    @Column(name = "eng_similar_words")
    private String engSimilarWords; // Comma-separated in DB

    // Helper to parse viet_similar_words into List
    public List<String> getVietSimilarWordsList() {
        if (vietSimilarWords == null || vietSimilarWords.isEmpty()) return List.of();
        return Arrays.asList(vietSimilarWords.split(",\\s*"));
    }

    public List<String> getEngSimilarWordsList() {
        if (engSimilarWords == null || engSimilarWords.isEmpty()) return List.of();
        return Arrays.asList(engSimilarWords.split(",\\s*"));
    }
}
