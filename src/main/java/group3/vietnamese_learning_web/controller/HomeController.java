package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.TopicProgressDTO;
import group3.vietnamese_learning_web.dto.UserResponseDTO;
import group3.vietnamese_learning_web.model.User;
import group3.vietnamese_learning_web.repository.UserRepository;
import group3.vietnamese_learning_web.service.TopicService;
import group3.vietnamese_learning_web.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Enumeration;

@Controller
@RequiredArgsConstructor
public class HomeController {
    private final TopicService topicService;
    private final AuthService authService;


    @GetMapping("/dashboard")
    public String dashboard(@RequestParam(required = false) Integer uId,
                            Model model, HttpSession session) {

        // Get user from session or use provided uId
//        Enumeration<String> attributeNames = session.getAttributeNames();
//        while (attributeNames.hasMoreElements()) {
//            String name = attributeNames.nextElement();
//            Object value = session.getAttribute(name);
//            System.out.println("Session attribute: " + name + " = " + value);
//        }

//        UserResponseDTO user = (UserResponseDTO) session.getAttribute("username")

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            System.out.println("Current logged-in user: " + authentication.getPrincipal().toString());
        }


        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);
        Integer userId = user.getUId();

        if (userId == null) {
            return "redirect:/login";
        }

        try {
            int streak = authService.calculateStreak(userId);
            user.setStreak(streak);
            List<TopicProgressDTO> topics = topicService.getTopicProgressByUser(userId);
            model.addAttribute("topics", topics);
            model.addAttribute("user", user); // Provide user info to template

            return "dashboard"; // Your main dashboard template (the one with the HTML you provided)
        } catch (Exception e) {
            model.addAttribute("error", "Failed to load dashboard: " + e.getMessage());
            return "login";
        }
    }

    // Handle root path
    @GetMapping("/")
    public String home(HttpSession session) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getPrincipal())) {
            return "redirect:/dashboard";
        }
        return "redirect:/login";
    }
}