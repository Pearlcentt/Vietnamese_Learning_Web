package group3.vietnamese_learning_web.dto;

import group3.vietnamese_learning_web.model.Gender;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserResponseDTO {
    private Integer uId;
    private String username;
    private String email;
    private String name;
    private LocalDate dob;
    private Gender gender;
    private int streak;
    private int gems;
}
