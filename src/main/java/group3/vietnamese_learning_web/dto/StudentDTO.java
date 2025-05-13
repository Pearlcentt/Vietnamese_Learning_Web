package group3.vietnamese_learning_web.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDTO {
    private Long id;
    private String name;
    private String email;
    private String bio;
    private LocalDate dateOfBirth;
    private String avatarUrl;
    private Integer totalPoints;
    private Integer level;
    private Set<Long> badgeIds;
    private Set<Long> friendIds;
}