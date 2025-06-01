package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.LessonDTO;
import group3.vietnamese_learning_web.dto.LessonWithProgressDTO;
import group3.vietnamese_learning_web.model.LessonType;
import group3.vietnamese_learning_web.dto.UserResponseDTO;
import group3.vietnamese_learning_web.service.LessonService;
import group3.vietnamese_learning_web.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/lessons")
public class LessonController {
    private final LessonService lessonService;
    private final AuthService authService;

    // 1. List all lessons in a topic with progress status (recommended as main method)
    @GetMapping
    public String getLessonsWithProgress(@RequestParam Integer topicId, Model model) {
        // Get userId from logged-in user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);
        Integer userId = user.getUId();

        // Use projection-based service method for status/progress
        List<LessonWithProgressDTO> lessons = lessonService.getLessonsWithProgress(topicId, userId);
        model.addAttribute("lessons", lessons);
        model.addAttribute("user", user);
        return "lessons";
    }

    // 2. Get lesson detail (for question/answer view)
    @GetMapping("/{topicId}/{lessonId}")
    public String getLesson(@PathVariable Integer topicId, @PathVariable Integer lessonId, Model model) {
        LessonDTO lesson = lessonService.getLesson(topicId, lessonId);
        model.addAttribute("lesson", lesson);
        return "lesson-detail";
    }

    // 3. List lessons by type in topic (for filtering)
    @GetMapping("/by-type")
    public String getLessonsByTypeInTopic(@RequestParam Integer topicId, @RequestParam LessonType lessonType, Model model) {
        // Get userId from logged-in user if you want to include status, else keep as is
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);
        Integer userId = user.getUId();

        // Optional: create a version of getLessonsWithProgress that also filters by type
        List<LessonWithProgressDTO> lessons = lessonService.getLessonsWithProgressByType(topicId, userId, lessonType);
        model.addAttribute("lessons", lessons);
        model.addAttribute("user", user);
        return "lessons";
    }

    // (Optional, legacy, or if you want a raw status-less list)
    @GetMapping("/raw")
    public String getLessonsByTopicRaw(@RequestParam Integer topicId, Model model) {
        List<LessonDTO> lessons = lessonService.getLessonsByTopicId(topicId);
        model.addAttribute("lessons", lessons);
        return "lessons";
    }

    // You can remove or deprecate this endpoint, since /lessons now does this with progress!
    // @GetMapping("/progress")
    // public String getLessonsWithProgressOld(@RequestParam Integer topicId, @RequestParam Integer userId, Model model) {
    //     List<LessonWithProgressDTO> lessons = lessonService.getLessonsWithProgress(topicId, userId);
    //     model.addAttribute("lessons", lessons);
    //     return "lessons";
    // }

}
