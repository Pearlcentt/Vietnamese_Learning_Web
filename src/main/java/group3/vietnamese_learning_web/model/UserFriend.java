package group3.vietnamese_learning_web.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_friends")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFriend {
    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "friend_id", length = 255)
    private String friendId;

    // Helper method to get friend IDs as integers from comma-separated string
    public java.util.List<Integer> getFriendIdsList() {
        if (friendId == null || friendId.trim().isEmpty()) {
            return new java.util.ArrayList<>();
        }

        java.util.List<Integer> result = new java.util.ArrayList<>();
        String[] idArray = friendId.split(",");
        for (String idStr : idArray) {
            try {
                Integer id = Integer.parseInt(idStr.trim());
                if (id > 0) {
                    result.add(id);
                }
            } catch (NumberFormatException e) {
                System.err.println("Invalid friend ID in comma-separated list: " + idStr);
            }
        }
        return result;
    }

    // Helper method to set friend IDs from a list of integers
    public void setFriendIdsList(java.util.List<Integer> friendIdsList) {
        if (friendIdsList == null || friendIdsList.isEmpty()) {
            this.friendId = "";
        } else {
            this.friendId = friendIdsList.stream()
                    .map(String::valueOf)
                    .collect(java.util.stream.Collectors.joining(","));
        }
    }

    // Helper method to add a friend ID
    public void addFriendId(Integer friendIdToAdd) {
        java.util.List<Integer> currentFriends = getFriendIdsList();
        if (!currentFriends.contains(friendIdToAdd)) {
            currentFriends.add(friendIdToAdd);
            setFriendIdsList(currentFriends);
        }
    }

    // Helper method to remove a friend ID
    public void removeFriendId(Integer friendIdToRemove) {
        java.util.List<Integer> currentFriends = getFriendIdsList();
        currentFriends.remove(friendIdToRemove);
        setFriendIdsList(currentFriends);
    }
}
