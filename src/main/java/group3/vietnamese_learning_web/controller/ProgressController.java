package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.ProgressDTO;
import group3.vietnamese_learning_web.dto.UserResponseDTO;
import group3.vietnamese_learning_web.model.ProgressStatus;
import group3.vietnamese_learning_web.service.ProgressService;
import group3.vietnamese_learning_web.service.AuthService;
import group3.vietnamese_learning_web.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {
    private final ProgressService progressService;
    private final AuthService authService;
    private final LeaderboardService leaderboardService;

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
    public ProgressDTO getProgress(@PathVariable Integer uid, @PathVariable Integer topicId,
            @PathVariable Integer lessonId) {
        return progressService.getProgress(uid, topicId, lessonId);
    }

    // Update progress (could use @RequestBody for more complex needs)
    @PutMapping("/update")
    public ProgressDTO updateProgress(
            @RequestParam Integer uid,
            @RequestParam Integer topicId,
            @RequestParam Integer lessonId,
            @RequestParam Integer score,
            @RequestParam ProgressStatus status) {
        return progressService.updateProgress(uid, topicId, lessonId, score, status);
    } // Complete lesson endpoint called from frontend @PostMapping("/complete")

    public ResponseEntity<String> completeLesson(
            @RequestParam Integer topicId,
            @RequestParam Integer lessonId,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            UserResponseDTO user = authService.getUserByUsername(username);
            Integer userId = user.getUId();

            // Check if lesson was already completed
            ProgressDTO existingProgress = progressService.getProgress(userId, topicId, lessonId);
            boolean wasAlreadyCompleted = existingProgress != null &&
                    existingProgress.getStatus() == ProgressStatus.Completed; // Mark lesson as completed with max score
            progressService.updateProgress(userId, topicId, lessonId, 100, ProgressStatus.Completed);

            // Points are now calculated dynamically from Progress table scores
            // No need to manually add points - they're calculated from progress scores
            if (!wasAlreadyCompleted) {
                return ResponseEntity.ok("Lesson completed successfully! Your score has been updated!");
            } else {
                return ResponseEntity.ok("Lesson completed! (No additional points - already completed before)");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save progress: " + e.getMessage());
        }
    }
}
