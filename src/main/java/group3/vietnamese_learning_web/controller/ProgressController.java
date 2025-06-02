package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.ProgressDTO;
import group3.vietnamese_learning_web.dto.ProgressUpdateResult;
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
    }    // Update progress (could use @RequestBody for more complex needs)
    @PutMapping("/update")
    public ProgressDTO updateProgress(
            @RequestParam Integer uid,
            @RequestParam Integer topicId,
            @RequestParam Integer lessonId,
            @RequestParam Integer score,
            @RequestParam ProgressStatus status) {
        return progressService.updateProgressSimple(uid, topicId, lessonId, score, status);
    }

    // Start lesson endpoint - marks lesson as "In Progress" when user begins
    @PostMapping("/start")
    public ResponseEntity<String> startLesson(
            @RequestParam Integer topicId,
            @RequestParam Integer lessonId,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            UserResponseDTO user = authService.getUserByUsername(username);
            Integer userId = user.getUId();

            // Check current progress
            ProgressDTO existingProgress = progressService.getProgress(userId, topicId, lessonId);            // Only update to In_Progress if not already completed
            if (existingProgress == null || existingProgress.getStatus() != ProgressStatus.Completed) {
                // Mark lesson as in progress with initial score
                progressService.updateProgressSimple(userId, topicId, lessonId, 0, ProgressStatus.In_Progress);
                return ResponseEntity.ok("Lesson started - marked as In Progress");
            } else {
                return ResponseEntity.ok("Lesson already completed - starting review mode");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to start lesson: " + e.getMessage());
        }
    } // Complete lesson endpoint called from frontend with actual score

    @PostMapping("/complete")
    public ResponseEntity<String> completeLesson(
            @RequestParam Integer topicId,
            @RequestParam Integer lessonId,
            @RequestParam Integer score,
            @RequestParam Integer totalQuestions,
            Authentication authentication) {

        System.out.println("=== COMPLETE LESSON ENDPOINT CALLED ===");
        System.out.println("topicId: " + topicId);
        System.out.println("lessonId: " + lessonId);
        System.out.println("score: " + score);
        System.out.println("totalQuestions: " + totalQuestions);
        System.out.println("authentication: " + authentication);
        System.out.println("authentication.isAuthenticated(): "
                + (authentication != null ? authentication.isAuthenticated() : "null"));

        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                System.err.println("ERROR: User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            String username = authentication.getName();
            System.out.println("username: " + username);

            UserResponseDTO user = authService.getUserByUsername(username);
            if (user == null) {
                System.err.println("ERROR: User not found for username: " + username);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found");
            }

            Integer userId = user.getUId();
            System.out.println("userId: " + userId);            // Calculate score percentage (100% = 10,000 points)
            int maxScore = 10000;
            int actualScore = Math.min(maxScore, (score * maxScore) / totalQuestions);
            System.out.println("Calculated actualScore: " + actualScore + " (from " + score + "*" + maxScore + "/"
                    + totalQuestions + ")");            // Determine status based on percentage correct (not absolute score)
            ProgressStatus status;
            if (score >= totalQuestions) { // 100% correct answers
                status = ProgressStatus.Completed; // Only "Completed" when 100% correct
            } else {
                status = ProgressStatus.In_Progress; // "In Progress" when not perfect
            }
            System.out.println("Determined status: " + status);            // Check if lesson was already completed (for debugging only)
            ProgressDTO existingProgress = progressService.getProgress(userId, topicId, lessonId);
            System.out.println("Existing progress: " + existingProgress);// Update progress with actual score and status
            System.out.println("About to call progressService.updateProgress...");
            ProgressUpdateResult updateResult = progressService.updateProgress(userId, topicId, lessonId, actualScore, status);
            System.out.println("DEBUG: Progress updated for user " + userId + " - " + updateResult.getUpdateSummary());            // Check if score was actually updated
            boolean scoreImproved = updateResult.isScoreUpdated();

            // Sync user points with updated Progress scores
            System.out.println("DEBUG: Syncing points for user " + userId);
            leaderboardService.syncUserPointsFromProgress(userId);
            System.out.println("DEBUG: Points sync completed for user " + userId);            String message;
            if (status == ProgressStatus.Completed) {
                if (updateResult.isNewProgress() || 
                    (updateResult.getPreviousStatus() != ProgressStatus.Completed)) {
                    message = String.format("Perfect! Lesson completed with %d/%d correct answers! +%d points",
                            score, totalQuestions, actualScore);
                } else if (scoreImproved) {
                    message = String.format("Excellent improvement! Perfect score with %d/%d correct answers! Score updated from %d to %d points",
                            score, totalQuestions, 
                            updateResult.getPreviousScore() != null ? updateResult.getPreviousScore() : 0, 
                            actualScore);
                } else {
                    message = String.format("Perfect score again! %d/%d correct answers (score unchanged: %d points)",
                            score, totalQuestions, actualScore);
                }
            } else {
                if (scoreImproved) {
                    message = String.format(
                            "Good progress! %d/%d correct answers. Score improved from %d to %d points. Get all questions right to complete the lesson!",
                            score, totalQuestions, 
                            updateResult.getPreviousScore() != null ? updateResult.getPreviousScore() : 0, 
                            actualScore);
                } else {
                    message = String.format(
                            "Good try! %d/%d correct answers (score unchanged: %d points). Get all questions right to complete the lesson!",
                            score, totalQuestions, actualScore);
                }
            }
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            System.err.println("ERROR in completeLesson: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save progress: " + e.getMessage());
        }
    }
}
