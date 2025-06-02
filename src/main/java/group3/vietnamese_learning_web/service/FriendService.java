package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.model.UserFriend;
import group3.vietnamese_learning_web.repository.UserFriendRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FriendService {
    private final UserFriendRepository userFriendRepository;

    // In-memory maps for demo (can be replaced with database tables later)
    private final Map<Integer, Set<Integer>> friendRequests = new HashMap<>(); // key: targetUid, value: Set of
                                                                               // requester UIDs

    // Note: friends map is now backed by User.friendIds in database
    // but we keep this for backward compatibility and caching
    private final Map<Integer, Set<Integer>> friends = new HashMap<>(); // key: uid, value: Set of friend UIDs

    @Transactional
    public boolean sendFriendRequest(Integer fromUid, Integer toUid) {
        if (fromUid.equals(toUid))
            return false;
        friendRequests.computeIfAbsent(toUid, k -> new HashSet<>()).add(fromUid);
        return true;
    }

    @Transactional
    public boolean acceptFriendRequest(Integer userUid, Integer requesterUid) {
        Set<Integer> requests = friendRequests.getOrDefault(userUid, new HashSet<>());
        if (requests.remove(requesterUid)) {
            // Add to in-memory cache
            friends.computeIfAbsent(userUid, k -> new HashSet<>()).add(requesterUid);
            friends.computeIfAbsent(requesterUid, k -> new HashSet<>()).add(userUid);

            // Update database - add friendship to both users' friendIds
            updateUserFriendship(userUid, requesterUid, true);
            updateUserFriendship(requesterUid, userUid, true);

            return true;
        }
        return false;
    }

    @Transactional
    public boolean declineFriendRequest(Integer userUid, Integer requesterUid) {
        Set<Integer> requests = friendRequests.getOrDefault(userUid, new HashSet<>());
        return requests.remove(requesterUid);
    }

    public Set<Integer> getFriendRequests(Integer uid) {
        return friendRequests.getOrDefault(uid, Collections.emptySet());
    }

    public Set<Integer> getFriends(Integer uid) {
        // First try to get from database
        Set<Integer> dbFriends = getFriendsFromDatabase(uid);
        if (!dbFriends.isEmpty()) {
            // Update cache and return database results
            friends.put(uid, dbFriends);
            return dbFriends;
        }
        // Fall back to in-memory cache
        return friends.getOrDefault(uid, Collections.emptySet());
    }

    public boolean areFriends(Integer uid1, Integer uid2) {
        // Check database first
        Set<Integer> dbFriends = getFriendsFromDatabase(uid1);
        if (!dbFriends.isEmpty()) {
            return dbFriends.contains(uid2);
        }
        // Fall back to in-memory cache
        return friends.getOrDefault(uid1, Collections.emptySet()).contains(uid2);
    }

    @Transactional
    public boolean cancelFriendRequest(Integer fromUid, Integer toUid) {
        Set<Integer> requests = friendRequests.getOrDefault(toUid, new HashSet<>());
        return requests.remove(fromUid);
    }

    @Transactional
    public boolean unfriend(Integer uid1, Integer uid2) {
        // Remove from in-memory cache
        boolean removed1 = friends.getOrDefault(uid1, Collections.emptySet()).remove(uid2);
        boolean removed2 = friends.getOrDefault(uid2, Collections.emptySet()).remove(uid1);

        // Update database - remove friendship from both users' friendIds
        updateUserFriendship(uid1, uid2, false);
        updateUserFriendship(uid2, uid1, false);

        return removed1 || removed2;
    }

    // Get sent friend requests by a user
    public Set<Integer> getSentFriendRequests(Integer fromUid) {
        Set<Integer> sentRequests = new HashSet<>();
        for (Map.Entry<Integer, Set<Integer>> entry : friendRequests.entrySet()) {
            if (entry.getValue().contains(fromUid)) {
                sentRequests.add(entry.getKey());
            }
        }
        return sentRequests;
    }

    // Helper method to get friends from database
    private Set<Integer> getFriendsFromDatabase(Integer uid) {
        try {
            Optional<UserFriend> userFriendOpt = userFriendRepository.findByUserId(uid);
            if (userFriendOpt.isPresent()) {
                UserFriend userFriend = userFriendOpt.get();
                // Use the helper method to get friend IDs as integers
                List<Integer> friendIdsList = userFriend.getFriendIdsList();
                return new HashSet<>(friendIdsList);
            }
        } catch (Exception e) {
            System.err.println("Error fetching friends from database for user " + uid + ": " + e.getMessage());
        }
        return Collections.emptySet();
    } // Helper method to update user friendship in database

    @Transactional
    private void updateUserFriendship(Integer userId, Integer friendId, boolean addFriend) {
        try {
            Optional<UserFriend> userFriendOpt = userFriendRepository.findByUserId(userId);
            UserFriend userFriend;

            if (userFriendOpt.isPresent()) {
                userFriend = userFriendOpt.get();
            } else {
                // Create new UserFriend record if it doesn't exist
                userFriend = UserFriend.builder()
                        .userId(userId)
                        .friendId("")
                        .build();
            }

            if (addFriend) {
                // Use the helper method to add friend
                userFriend.addFriendId(friendId);
            } else {
                // Use the helper method to remove friend
                userFriend.removeFriendId(friendId);
            }

            userFriendRepository.save(userFriend);
        } catch (Exception e) {
            System.err.println("Error updating friendship in database for user " + userId + ": " + e.getMessage());
        }
    }
}
