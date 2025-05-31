package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.LessonDTO;
import group3.vietnamese_learning_web.model.LessonType;
import group3.vietnamese_learning_web.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/lessons")
public class LessonController {
    private final LessonService lessonService;

    // 1. List all lessons in a topic
    @GetMapping
    public String getLessonsByTopic(@RequestParam Integer topicId, Model model) {
        List<LessonDTO> lessons = lessonService.getLessonsByTopicId(topicId);
        model.addAttribute("lessons", lessons);
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
        List<LessonDTO> lessons = lessonService.getLessonsByTypeInTopic(topicId, lessonType);
        model.addAttribute("lessons", lessons);
        return "lessons";
    }

    @GetMapping("/lessons/progress")
    public String getLessonsWithProgress(@RequestParam Integer topicId, @RequestParam Integer userId, Model model) {
        List<LessonWithProgressDTO> lessons = lessonService.getLessonsWithProgress(topicId, userId);
        model.addAttribute("lessons", lessons);
        return "lessons";
}

}
