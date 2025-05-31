package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.UserLoginDTO;
import group3.vietnamese_learning_web.dto.UserRegistrationDTO;
import group3.vietnamese_learning_web.dto.UserResponseDTO;
import group3.vietnamese_learning_web.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

@Controller
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @GetMapping("/login")
    public String login(@RequestParam(value = "error", required = false) String error, Model model) {
        if (error != null) {
            model.addAttribute("error", "Invalid username or password.");
        }
        return "login";
    }

    @GetMapping("/register")
    public String showRegistrationPage() {
        return "register";
    }

    @PostMapping("/register")
    public String processRegistration(@ModelAttribute UserRegistrationDTO dto, Model model) {
        try {
            authService.register(dto);
            model.addAttribute("success", "Registration successful! Please log in.");
            return "login"; // Return to login page with success message
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            return "login"; // Return to login page (signup section) with error
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}