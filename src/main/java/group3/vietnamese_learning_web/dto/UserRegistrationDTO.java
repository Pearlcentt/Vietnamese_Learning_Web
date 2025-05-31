package group3.vietnamese_learning_web.dto;

import group3.vietnamese_learning_web.model.Gender;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegistrationDTO {
    private String username;
    private String email;
    private String password;
    private String name;
    private LocalDate dob;
    private Gender gender;
}
