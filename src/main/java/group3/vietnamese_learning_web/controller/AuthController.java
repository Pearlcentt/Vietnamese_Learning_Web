package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.UserRegistrationDTO;
import group3.vietnamese_learning_web.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
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
        model.addAttribute("userRegistrationDto", new UserRegistrationDTO());
        return "login";
    }

    @GetMapping("/register")
    public String showRegistrationPage() {
        return "register";
    }

    @PostMapping("/register")
    public String processRegistration(@ModelAttribute UserRegistrationDTO dto,
            BindingResult bindingResult,
            Model model) {
        // Check for binding errors (like the gender conversion issue)
        if (bindingResult.hasErrors()) {
            model.addAttribute("error", "Please check your input and try again.");
            model.addAttribute("userRegistrationDto", dto); // Keep the form data
            return "login"; // Return to login page (signup section) with error
        }

        try {
            authService.register(dto);
            model.addAttribute("success", "Registration successful! Please log in.");
            model.addAttribute("userRegistrationDto", new UserRegistrationDTO());
            return "login"; // Return to login page with success message
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("userRegistrationDto", dto); // Keep the form data
            return "login"; // Return to login page (signup section) with error
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}