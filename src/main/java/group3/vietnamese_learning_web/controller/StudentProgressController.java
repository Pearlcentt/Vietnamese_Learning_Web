package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.StudentProgressDTO;
import group3.vietnamese_learning_web.service.LessonService;
import group3.vietnamese_learning_web.service.StudentProgressService;
import group3.vietnamese_learning_web.service.StudentService;
import group3.vietnamese_learning_web.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/progress")
@RequiredArgsConstructor
public class StudentProgressController {
    private final StudentProgressService progressService;
    private final StudentService studentService;
    private final LessonService lessonService;
    private final TopicService topicService;

    @GetMapping("/student/{studentId}")
    public String studentProgress(@PathVariable Long studentId, Model model) {
        model.addAttribute("student", studentService.findById(studentId));
        model.addAttribute("progressEntries", progressService.findByStudentId(studentId));
        return "progress/student";
    }
    
    @GetMapping("/student/{studentId}/topic/{topicId}")
    public String topicProgress(@PathVariable Long studentId, @PathVariable Long topicId, Model model) {
        model.addAttribute("student", studentService.findById(studentId));
        model.addAttribute("topic", topicService.findById(topicId));
        model.addAttribute("progressEntries", progressService.findByStudentIdAndTopicId(studentId, topicId));
        model.addAttribute("averageProgress", progressService.getAverageProgressForTopic(studentId, topicId));
        return "progress/topic";
    }
    
    @GetMapping("/record-lesson")
    public String recordLessonProgressForm(@RequestParam Long studentId, @RequestParam Long lessonId, Model model) {
        // Check if there's existing progress
        try {
            StudentProgressDTO existingProgress = progressService.findByStudentIdAndLessonId(studentId, lessonId);
            model.addAttribute("progress", existingProgress);
        } catch (Exception e) {
            // No existing progress, create new one
            StudentProgressDTO newProgress = new StudentProgressDTO();
            newProgress.setStudentId(studentId);
            newProgress.setLessonId(lessonId);
            newProgress.setScorePercentage(0.0);
            newProgress.setCompleted(false);
            model.addAttribute("progress", newProgress);
        }
        
        model.addAttribute("student", studentService.findById(studentId));
        model.addAttribute("lesson", lessonService.findById(lessonId));
        
        return "progress/record-lesson";
    }
    
    @PostMapping("/record-lesson")
    public String saveProgress(@ModelAttribute StudentProgressDTO progress) {
        progressService.saveProgress(progress);
        return "redirect:/progress/student/" + progress.getStudentId();
    }
    
    @GetMapping("/record-topic")
    public String recordTopicProgressForm(@RequestParam Long studentId, @RequestParam Long topicId, Model model) {
        StudentProgressDTO progress = new StudentProgressDTO();
        progress.setStudentId(studentId);
        progress.setTopicId(topicId);
        
        model.addAttribute("progress", progress);
        model.addAttribute("student", studentService.findById(studentId));
        model.addAttribute("topic", topicService.findById(topicId));
        
        return "progress/record-topic";
    }
    
    @PostMapping("/record-topic")
    public String saveTopicProgress(@ModelAttribute StudentProgressDTO progress) {
        progressService.saveProgress(progress);
        return "redirect:/progress/student/" + progress.getStudentId();
    }
    
    @GetMapping("/statistics/{studentId}")
    public String viewProgressStatistics(@PathVariable Long studentId, Model model) {
        model.addAttribute("student", studentService.findById(studentId));
        model.addAttribute("completedLessonsCount", progressService.countCompletedLessons(studentId));
        
        // Calculate a progress summary that could be used to create a progress chart
        model.addAttribute("allProgress", progressService.findByStudentId(studentId));
        
        return "progress/statistics";
    }
    
    @PostMapping("/delete/{id}")
    public String deleteProgress(@PathVariable Long id, @RequestParam Long studentId) {
        progressService.deleteProgress(id);
        return "redirect:/progress/student/" + studentId;
    }
}