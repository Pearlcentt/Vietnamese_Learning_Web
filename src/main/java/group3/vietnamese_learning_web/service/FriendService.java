package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.model.User;
import group3.vietnamese_learning_web.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FriendService {
    private final UserRepository userRepository;

    // In a real app, use a FriendRequest entity/table. Here, use in-memory map for demo.
    private final Map<Integer, Set<Integer>> friendRequests = new HashMap<>(); // key: targetUid, value: Set of requester UIDs
    private final Map<Integer, Set<Integer>> friends = new HashMap<>(); // key: uid, value: Set of friend UIDs

    public boolean sendFriendRequest(Integer fromUid, Integer toUid) {
        if (fromUid.equals(toUid)) return false;
        friendRequests.computeIfAbsent(toUid, k -> new HashSet<>()).add(fromUid);
        return true;
    }

    public boolean acceptFriendRequest(Integer userUid, Integer requesterUid) {
        Set<Integer> requests = friendRequests.getOrDefault(userUid, new HashSet<>());
        if (requests.remove(requesterUid)) {
            friends.computeIfAbsent(userUid, k -> new HashSet<>()).add(requesterUid);
            friends.computeIfAbsent(requesterUid, k -> new HashSet<>()).add(userUid);
            return true;
        }
        return false;
    }

    public boolean declineFriendRequest(Integer userUid, Integer requesterUid) {
        Set<Integer> requests = friendRequests.getOrDefault(userUid, new HashSet<>());
        return requests.remove(requesterUid);
    }

    public Set<Integer> getFriendRequests(Integer uid) {
        return friendRequests.getOrDefault(uid, Collections.emptySet());
    }

    public Set<Integer> getFriends(Integer uid) {
        return friends.getOrDefault(uid, Collections.emptySet());
    }

    public boolean areFriends(Integer uid1, Integer uid2) {
        return friends.getOrDefault(uid1, Collections.emptySet()).contains(uid2);
    }

    public boolean cancelFriendRequest(Integer fromUid, Integer toUid) {
        Set<Integer> requests = friendRequests.getOrDefault(toUid, new HashSet<>());
        return requests.remove(fromUid);
    }

    public boolean unfriend(Integer uid1, Integer uid2) {
        boolean removed1 = friends.getOrDefault(uid1, Collections.emptySet()).remove(uid2);
        boolean removed2 = friends.getOrDefault(uid2, Collections.emptySet()).remove(uid1);
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
}
