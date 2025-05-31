package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.UserLoginDTO;
import group3.vietnamese_learning_web.dto.UserRegistrationDTO;
import group3.vietnamese_learning_web.dto.UserResponseDTO;
import group3.vietnamese_learning_web.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @GetMapping("/login")
    public String showLoginPage() {
        return "login";
    }

    @PostMapping("/login")
    public String processLogin(@ModelAttribute UserLoginDTO dto, Model model) {
        try {
            UserResponseDTO user = authService.authenticate(dto);
            model.addAttribute("user", user);
            return "redirect:/dashboard";
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            return "login";
        }
    }

    @GetMapping("/register")
    public String showRegistrationPage() {
        return "register";
    }

    @PostMapping("/register")
    public String processRegistration(@ModelAttribute UserRegistrationDTO dto, Model model) {
        try {
            authService.register(dto);
            return "redirect:/login";
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            return "register";
        }
    }
}
