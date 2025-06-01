package group3.vietnamese_learning_web.model;

import group3.vietnamese_learning_web.converter.ProgressStatusConverter;
import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;

@Entity
@Table(name = "Progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Progress {

    @EmbeddedId
    private ProgressId id;

    private Integer score;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Convert(converter = ProgressStatusConverter.class)
    @Builder.Default
    private ProgressStatus status = ProgressStatus.Not_Started;

    @Column(name = "last_updated", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp lastUpdated;
}
