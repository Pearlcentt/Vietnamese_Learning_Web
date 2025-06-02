package group3.vietnamese_learning_web.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEditForm {
    private String displayName;
    private String email;
    private String currentPassword;
    private String newPassword;
    private String avatar; // Added avatar field for profile editing
}