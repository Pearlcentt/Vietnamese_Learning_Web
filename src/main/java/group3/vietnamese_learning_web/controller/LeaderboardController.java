package group3.vietnamese_learning_web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class LeaderboardController {
    @GetMapping("/leaderboard")
    public String leaderboard(Model model) {
        return "leaderboard";
    }
}