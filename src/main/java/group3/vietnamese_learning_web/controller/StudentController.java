package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.StudentDTO;
import group3.vietnamese_learning_web.service.BadgeService;
import group3.vietnamese_learning_web.service.StudentProgressService;
import group3.vietnamese_learning_web.service.StudentService;
import group3.vietnamese_learning_web.service.TestResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/students")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;
    private final BadgeService badgeService;
    private final StudentProgressService progressService;
    private final TestResultService testResultService;

    @GetMapping
    public String listStudents(Model model) {
        model.addAttribute("students", studentService.findAll());
        return "student/list";
    }

    @GetMapping("/{id}")
    public String detailStudent(@PathVariable Long id, Model model) {
        model.addAttribute("student", studentService.findById(id));
        return "student/detail";
    }
    
    @GetMapping("/profile/{id}")
    public String viewProfile(@PathVariable Long id, Model model) {
        StudentDTO student = studentService.findById(id);
        model.addAttribute("student", student);
        
        // Add progress data
        model.addAttribute("progress", progressService.findByStudentId(id));
        
        // Add test results
        model.addAttribute("testResults", testResultService.findByStudentId(id));
        
        // Load badges
        if (student.getBadgeIds() != null && !student.getBadgeIds().isEmpty()) {
            model.addAttribute("badges", student.getBadgeIds().stream()
                .map(badgeId -> badgeService.findById(badgeId))
                .toList());
        }
        
        return "student/profile";
    }

    @GetMapping("/register")
    public String registerForm(Model model) {
        model.addAttribute("student", new StudentDTO());
        return "student/register";
    }

    @PostMapping("/register")
    public String register(@ModelAttribute StudentDTO dto, @RequestParam String password) {
        studentService.createStudent(dto, password);
        return "redirect:/login";
    }

    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        model.addAttribute("student", studentService.findById(id));
        return "student/edit";
    }

    @PostMapping("/update/{id}")
    public String updateStudent(@PathVariable Long id, @ModelAttribute StudentDTO dto) {
        studentService.updateStudent(id, dto);
        return "redirect:/students/profile/" + id;
    }
    
    @GetMapping("/change-password/{id}")
    public String changePasswordForm(@PathVariable Long id, Model model) {
        model.addAttribute("studentId", id);
        return "student/change-password";
    }
    
    @PostMapping("/change-password/{id}")
    public String changePassword(
            @PathVariable Long id, 
            @RequestParam String currentPassword, 
            @RequestParam String newPassword, 
            @RequestParam String confirmPassword) {
        
        if (!newPassword.equals(confirmPassword)) {
            return "redirect:/students/change-password/" + id + "?error=mismatch";
        }
        
        try {
            studentService.updatePassword(id, currentPassword, newPassword);
            return "redirect:/students/profile/" + id + "?success=true";
        } catch (IllegalArgumentException e) {
            return "redirect:/students/change-password/" + id + "?error=wrong-password";
        }
    }
    
    @PostMapping("/upload-avatar/{id}")
    public String uploadAvatar(@PathVariable Long id, @RequestParam("avatar") MultipartFile avatarFile) {
        // Implement file upload logic and save the avatar URL
        // This would typically involve saving the file to a storage location and updating the URL
        
        // For now, let's assume we have the URL
        String avatarUrl = "/uploads/avatars/" + id + "_" + avatarFile.getOriginalFilename();
        studentService.updateAvatar(id, avatarUrl);
        
        return "redirect:/students/profile/" + id;
    }
    
    @GetMapping("/leaderboard")
    public String viewLeaderboard(Model model) {
        model.addAttribute("students", studentService.getGlobalLeaderboard());
        return "student/leaderboard";
    }
    
    @GetMapping("/friends-leaderboard/{id}")
    public String viewFriendsLeaderboard(@PathVariable Long id, Model model) {
        model.addAttribute("students", studentService.getFriendsLeaderboard(id));
        model.addAttribute("student", studentService.findById(id));
        return "student/friends-leaderboard";
    }
    
    @PostMapping("/{studentId}/add-friend/{friendId}")
    public String addFriend(@PathVariable Long studentId, @PathVariable Long friendId) {
        studentService.addFriend(studentId, friendId);
        return "redirect:/students/profile/" + studentId;
    }
}