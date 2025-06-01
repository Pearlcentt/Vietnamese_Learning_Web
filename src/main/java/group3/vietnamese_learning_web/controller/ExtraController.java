package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.UserResponseDTO;
import group3.vietnamese_learning_web.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class ExtraController {
    private final AuthService authService;

    @GetMapping("/leaderboard")
    public String leaderboard(Model model) {
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);
        
        model.addAttribute("user", user);
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
}
