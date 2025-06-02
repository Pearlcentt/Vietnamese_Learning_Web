package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.UserEditForm;
import group3.vietnamese_learning_web.dto.UserResponseDTO;
import group3.vietnamese_learning_web.service.AuthService;
import group3.vietnamese_learning_web.service.LeaderboardService;
import group3.vietnamese_learning_web.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.Set;

@Controller
@RequestMapping("/")
@RequiredArgsConstructor
public class ExtraController {
    private final AuthService authService;
    private final LeaderboardService leaderboardService;
    private final FriendService friendService;

    @GetMapping("/leaderboard")
    public String leaderboard(Model model) {
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);

        // Populate friend data for the current user
        if (user != null) {
            populateFriendData(user);
        }

        // Get leaderboard data
        List<UserResponseDTO> topUsers = leaderboardService.getTopUsers(10);
        List<UserResponseDTO> friendsLeaderboard = user != null ?
                leaderboardService.getFriendsLeaderboard(user.getUId(), 10) : List.of();

        // Simple league simulation based on points
        String leagueName = "Bronze League";
        if (user.getPoints() != null) {
            if (user.getPoints() >= 100)
                leagueName = "Silver League";
            if (user.getPoints() >= 250)
                leagueName = "Gold League";
            if (user.getPoints() >= 500)
                leagueName = "Platinum League";
            if (user.getPoints() >= 1000)
                leagueName = "Diamond League";
        }

        model.addAttribute("user", user);
        model.addAttribute("currentUserDto", user);
        model.addAttribute("globalLeaderboardData", topUsers);
        model.addAttribute("friendsLeaderboardData", friendsLeaderboard);
        model.addAttribute("leagueSettingsDto", new LeagueSettings(leagueName, 7, 4));
        return "leaderboard";
    }

    @GetMapping("/profile")
    public String profile(Model model) {
        return profileAddFriend(model); // Delegate to profileAddFriend for consistency
    }

    @GetMapping("/profile_add_friend")
    public String profileAddFriend(Model model) {
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username); // Create edit form
        UserEditForm userEditForm = new UserEditForm();
        if (user != null) {
            userEditForm.setDisplayName(user.getName());
            userEditForm.setEmail(user.getEmail());
            userEditForm.setAvatar(user.getAvatar());
        }

        // Populate friend data for the user
        if (user != null) {
            populateFriendData(user);
        }

        // Add attributes to model
        model.addAttribute("userDto", user);
        model.addAttribute("userEditForm", userEditForm);
        model.addAttribute("viewOnly", false); // This is the user's own profile, so not view-only

        // For own profile, show incoming friend requests
        if (user != null) {
            model.addAttribute("friendRequests", friendService.getFriendRequests(user.getUId()));
        }

        return "profile_add_friend";
    }

    @GetMapping("/quests")
    public String quests(Model model) {
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);

        model.addAttribute("user", user);
        // For now, redirect to dashboard since quests aren't fully implemented
        return "redirect:/dashboard";
    }

    @GetMapping("/shop")
    public String shop(Model model) {
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);
        model.addAttribute("user", user);
        // For now, redirect to dashboard since shop isn't implemented
        return "redirect:/dashboard";
    }

    @PostMapping("/profile/update")
    public String updateProfile(
            @ModelAttribute("userEditForm") UserEditForm userEditForm,
            Model model) {
        try {
            // Get current user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName(); // Update the profile
            authService.updateProfile(username, userEditForm);

            // Redirect to profile page with success message
            return "redirect:/profile_add_friend?success=true";
        } catch (RuntimeException e) {
            // Handle error
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            UserResponseDTO user = authService.getUserByUsername(username); // Re-populate the form with user data
            UserEditForm newForm = new UserEditForm();
            newForm.setDisplayName(user.getName());
            newForm.setEmail(user.getEmail());
            newForm.setAvatar(user.getAvatar());

            model.addAttribute("userDto", user);
            model.addAttribute("userEditForm", newForm);
            model.addAttribute("viewOnly", false); // This is the user's own profile
            model.addAttribute("errorMessage", e.getMessage());

            // Return to the profile page with error
            return "profile_add_friend";
        }
    }

    // REST API endpoint for AJAX profile updates
    @PostMapping("/api/profile/update")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateProfileApi(
            @ModelAttribute("userEditForm") UserEditForm userEditForm) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Get current user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            // Update the profile
            authService.updateProfile(username, userEditForm);

            // Get updated user data
            UserResponseDTO updatedUser = authService.getUserByUsername(username);

            response.put("success", true);
            response.put("message", "Profile updated successfully!");
            response.put("user", updatedUser);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", "Failed to update profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // --- Friend Request Endpoints ---
    @GetMapping("/friends/search")
    @ResponseBody
    public ResponseEntity<?> searchFriends(@RequestParam String query) {
        System.out.println("=== SEARCH ENDPOINT HIT ===");
        try {
            System.out.println("DEBUG: Search request received with query: '" + query + "'");
            System.out.println("DEBUG: Query length: " + query.length());
            System.out.println("DEBUG: Query trimmed: '" + query.trim() + "'");

            List<UserResponseDTO> results = authService.searchUsersByName(query);
            System.out.println("DEBUG: Search results count: " + results.size());

            for (UserResponseDTO user : results) {
                System.out.println("DEBUG: Found user - ID: " + user.getUId() + ", Username: " + user.getUsername()
                        + ", Name: " + user.getName());
            }

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.out.println("DEBUG: Search failed with exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Search failed");
        }
    }

    @PostMapping("/friends/request/send/{targetUid}")
    @ResponseBody
    public ResponseEntity<?> sendFriendRequest(@PathVariable Integer targetUid) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);

        boolean sent = friendService.sendFriendRequest(user.getUId(), targetUid);

        if (sent) {
            return ResponseEntity.ok("Friend request sent");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot send friend request");
        }
    }

    @PostMapping("/friends/request/accept/{requesterUid}")
    @ResponseBody
    public ResponseEntity<?> acceptFriendRequest(@PathVariable Integer requesterUid) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);
        boolean accepted = friendService.acceptFriendRequest(user.getUId(), requesterUid);
        if (accepted) {
            return ResponseEntity.ok("Friend request accepted");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot accept friend request");
        }
    }

    @PostMapping("/friends/request/decline/{requesterUid}")
    @ResponseBody
    public ResponseEntity<?> declineFriendRequest(@PathVariable Integer requesterUid) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);
        boolean declined = friendService.declineFriendRequest(user.getUId(), requesterUid);
        if (declined) {
            return ResponseEntity.ok("Friend request declined");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot decline friend request");
        }
    }

    @PostMapping("/friends/request/cancel/{targetUid}")
    @ResponseBody
    public ResponseEntity<?> cancelFriendRequest(@PathVariable Integer targetUid) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);
        boolean cancelled = friendService.cancelFriendRequest(user.getUId(), targetUid);
        if (cancelled) {
            return ResponseEntity.ok("Friend request cancelled");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot cancel friend request");
        }
    }

    @PostMapping("/friends/unfriend/{friendUid}")
    @ResponseBody
    public ResponseEntity<?> unfriend(@PathVariable Integer friendUid) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);
        boolean unfriended = friendService.unfriend(user.getUId(), friendUid);
        if (unfriended) {
            return ResponseEntity.ok("Unfriended successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot unfriend user");
        }
    } // View another user's profile (read-only or with friend actions)

    @GetMapping("/profile/{uid}")
    public String viewUserProfile(@PathVariable Integer uid, Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO currentUser = authService.getUserByUsername(username);
        UserResponseDTO user = authService.getUserByUid(uid);
        if (user == null) {
            model.addAttribute("errorMessage", "User not found");
            return "error";
        }

        boolean isOwnProfile = currentUser != null && currentUser.getUId().equals(uid);

        // Populate friend data for the user being viewed
        populateFriendData(user);

        model.addAttribute("userDto", user);
        model.addAttribute("viewOnly", !isOwnProfile);
        if (!isOwnProfile) {
            boolean alreadyFriends = friendService.areFriends(currentUser.getUId(), uid);
            boolean requestSent = friendService.getFriendRequests(uid).contains(currentUser.getUId());
            boolean requestReceived = friendService.getFriendRequests(currentUser.getUId()).contains(uid);
            model.addAttribute("alreadyFriends", alreadyFriends);
            model.addAttribute("requestSent", requestSent);
            model.addAttribute("requestReceived", requestReceived);
        } else {
            // For own profile, show incoming friend requests
            model.addAttribute("friendRequests", friendService.getFriendRequests(currentUser.getUId()));
        }
        return "profile_add_friend";
    }

    /**
     * Helper method to populate friend data in UserResponseDTO
     */
    private void populateFriendData(UserResponseDTO user) {
        if (user == null || user.getUId() == null)
            return;// Get friends list (using optimized method to avoid N+1 queries)
        Set<Integer> friendIds = friendService.getFriends(user.getUId());
        List<UserResponseDTO> friendsList = new ArrayList<>();
        for (Integer friendId : friendIds) {
            UserResponseDTO friend = authService.getUserByUidWithoutStreak(friendId);
            if (friend != null) {
                friendsList.add(friend);
            }
        }
        user.setFriends(friendsList);

        // Get received friend requests (using optimized method to avoid N+1 queries)
        Set<Integer> receivedRequestIds = friendService.getFriendRequests(user.getUId());
        List<UserResponseDTO> receivedRequestsList = new ArrayList<>();
        for (Integer requesterId : receivedRequestIds) {
            UserResponseDTO requester = authService.getUserByUidWithoutStreak(requesterId);
            if (requester != null) {
                receivedRequestsList.add(requester);
            }
        }
        user.setReceivedFriendRequests(receivedRequestsList);

        // Get sent friend requests (using optimized method to avoid N+1 queries)
        Set<Integer> sentRequestIds = friendService.getSentFriendRequests(user.getUId());
        List<UserResponseDTO> sentRequestsList = new ArrayList<>();
        for (Integer targetId : sentRequestIds) {
            UserResponseDTO target = authService.getUserByUidWithoutStreak(targetId);
            if (target != null) {
                sentRequestsList.add(target);
            }
        }
        user.setSentFriendRequests(sentRequestsList);
    }

    // Simple DTO for league settings
    public static class LeagueSettings {
        private String name;
        private int promotionCount;
        private int daysLeft;

        public LeagueSettings(String name, int promotionCount, int daysLeft) {
            this.name = name;
            this.promotionCount = promotionCount;
            this.daysLeft = daysLeft;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getPromotionCount() {
            return promotionCount;
        }

        public void setPromotionCount(int promotionCount) {
            this.promotionCount = promotionCount;
        }

        public int getDaysLeft() {
            return daysLeft;
        }

        public void setDaysLeft(int daysLeft) {
            this.daysLeft = daysLeft;
        }
    }

    @GetMapping("/friends/test")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> testEndpoint(Authentication authentication) {
        System.out.println("=== TEST ENDPOINT HIT ===");
        System.out.println("Authentication: " + authentication);
        System.out.println("User: " + (authentication != null ? authentication.getName() : "null"));

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Test endpoint working");
        response.put("user", authentication != null ? authentication.getName() : "anonymous");
        response.put("timestamp", new java.util.Date());

        return ResponseEntity.ok(response);
    }
}