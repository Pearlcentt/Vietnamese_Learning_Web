package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.UserResponseDTO;
import group3.vietnamese_learning_web.service.AuthService;
import group3.vietnamese_learning_web.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ExtraController {
    private final AuthService authService;
    private final LeaderboardService leaderboardService;

    @GetMapping("/leaderboard")
    public String leaderboard(Model model) {
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);

        // Get leaderboard data
        List<UserResponseDTO> topUsers = leaderboardService.getTopUsers(10);

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
        model.addAttribute("friendsLeaderboardData", topUsers); // For now, same as global
        model.addAttribute("leagueSettingsDto", new LeagueSettings(leagueName, 7, 4));
        return "leaderboard";
    }

    @GetMapping("/profile")
    public String profile(Model model) {
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);

        model.addAttribute("user", user);
        return "profile_add_friend";
    }

    @GetMapping("/profile_add_friend")
    public String profileAddFriend(Model model) {
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);

        model.addAttribute("user", user);
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
}
