package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.LessonWithProgressDTO;
import group3.vietnamese_learning_web.model.User;
import group3.vietnamese_learning_web.service.LessonService;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @GetMapping("/lessons")
    public String viewLessons(@RequestParam("topicId") int topicId,
                              HttpSession session,
                              Model model) {

        User user = (User) session.getAttribute("currentUser");
        if (user == null) return "redirect:/login";

        List<LessonWithProgressDTO> lessons = lessonService.getLessonsForUserAndTopic(user.getUId(), topicId);
        model.addAttribute("lessons", lessons);
        model.addAttribute("topicId", topicId);
        return "lessons";
    }
}
