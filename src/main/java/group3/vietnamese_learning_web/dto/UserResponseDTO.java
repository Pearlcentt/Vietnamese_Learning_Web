package group3.vietnamese_learning_web.dto;

import group3.vietnamese_learning_web.model.Gender;
import lombok.*;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

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
    private Integer points;
    private String avatar; // User avatar URL/path
    @Builder.Default
    private List<String> friendIds = new ArrayList<>(); // Friend IDs as strings
    private LocalDate dateCreated; // Added to match template
    private List<UserResponseDTO> friends; // Added for friend list
    private List<UserResponseDTO> receivedFriendRequests; // Added for friend requests
    private List<UserResponseDTO> sentFriendRequests; // Added for sent requests
    private String currentLeague; // Added, can be null if not implemented
    private int top3Finishes; // Added, default to 0 if not implemented
}
