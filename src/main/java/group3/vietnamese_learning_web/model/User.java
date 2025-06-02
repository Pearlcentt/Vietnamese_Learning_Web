package group3.vietnamese_learning_web.model;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "User")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "u_id")
    private Integer uId;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Gender gender; // enum Gender { Male, Female, Other }

    @Builder.Default
    @Column(name = "points", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer points = 0;

    // New avatar field - URL or path to avatar image    @Builder.Default
    @Column(name = "avatar", length = 500)
    private String avatar = "/images/default_avatar.png";

    // Friend IDs stored as comma-separated string (e.g., "39,18,45")
    @Column(name = "friend_ids", length = 1000)
    private String friendIds;

    @Column(name = "date_created", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp dateCreated;

    // Helper method to get friend IDs as a list
    public List<Integer> getFriendIdsList() {
        if (friendIds == null || friendIds.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        List<Integer> result = new ArrayList<>();
        String[] idArray = friendIds.split(",");
        for (String idStr : idArray) {
            try {
                Integer friendId = Integer.parseInt(idStr.trim());
                if (friendId > 0) {
                    result.add(friendId);
                }
            } catch (NumberFormatException e) {
                System.err.println("Invalid friend ID in comma-separated list: " + idStr);
            }
        }
        return result;
    }

    // Helper method to set friend IDs from a list
    public void setFriendIdsList(List<Integer> friendIdsList) {
        if (friendIdsList == null || friendIdsList.isEmpty()) {
            this.friendIds = null;
        } else {
            this.friendIds = friendIdsList.stream()
                    .map(String::valueOf)
                    .collect(java.util.stream.Collectors.joining(","));
        }
    }

    // Helper method to add a friend ID
    public void addFriendId(Integer friendId) {
        List<Integer> currentFriends = getFriendIdsList();
        if (!currentFriends.contains(friendId)) {
            currentFriends.add(friendId);
            setFriendIdsList(currentFriends);
        }
    }

    // Helper method to remove a friend ID
    public void removeFriendId(Integer friendId) {
        List<Integer> currentFriends = getFriendIdsList();
        currentFriends.remove(friendId);
        setFriendIdsList(currentFriends);
    }
}