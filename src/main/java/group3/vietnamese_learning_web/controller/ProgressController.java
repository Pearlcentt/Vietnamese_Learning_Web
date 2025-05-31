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
    @GetMapping("/user/{uid}")
    public List<ProgressDTO> getProgressByUser(@PathVariable Integer uid) {
        return progressService.getProgressByUser(uid);
    }

    // Get all progress for a user in a topic
    @GetMapping("/user/{uid}/topic/{topicId}")
    public List<ProgressDTO> getProgressByUserAndTopic(@PathVariable Integer uid, @PathVariable Integer topicId) {
        return progressService.getProgressByUserAndTopic(uid, topicId);
    }

    // Get progress for a single lesson
    @GetMapping("/user/{uid}/topic/{topicId}/lesson/{lessonId}")
    public ProgressDTO getProgress(@PathVariable Integer uid, @PathVariable Integer topicId, @PathVariable Integer lessonId) {
        return progressService.getProgress(uid, topicId, lessonId);
    }

    // Update progress (could use @RequestBody for more complex needs)
    @PutMapping("/update")
    public ProgressDTO updateProgress(
            @RequestParam Integer uid,
            @RequestParam Integer topicId,
            @RequestParam Integer lessonId,
            @RequestParam Integer score,
            @RequestParam ProgressStatus status
    ) {
        return progressService.updateProgress(uid, topicId, lessonId, score, status);
    }
}
