package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.ProgressDTO;
import group3.vietnamese_learning_web.model.ProgressStatus;
import group3.vietnamese_learning_web.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {
    private final ProgressService progressService;

    // Get all progress for a user
    @GetMapping("/user/{uId}")
    public List<ProgressDTO> getProgressByUser(@PathVariable Integer uId) {
        return progressService.getProgressByUser(uId);
    }

    // Get all progress for a user in a topic
    @GetMapping("/user/{uId}/topic/{topicId}")
    public List<ProgressDTO> getProgressByUserAndTopic(@PathVariable Integer uId, @PathVariable Integer topicId) {
        return progressService.getProgressByUserAndTopic(uId, topicId);
    }

    // Get progress for a single lesson
    @GetMapping("/user/{uId}/topic/{topicId}/lesson/{lessonId}")
    public ProgressDTO getProgress(@PathVariable Integer uId, @PathVariable Integer topicId, @PathVariable Integer lessonId) {
        return progressService.getProgress(uId, topicId, lessonId);
    }

    // Update progress (could use @RequestBody for more complex needs)
    @PutMapping("/update")
    public ProgressDTO updateProgress(
            @RequestParam Integer uId,
            @RequestParam Integer topicId,
            @RequestParam Integer lessonId,
            @RequestParam Integer score,
            @RequestParam ProgressStatus status
    ) {
        return progressService.updateProgress(uId, topicId, lessonId, score, status);
    }
}
