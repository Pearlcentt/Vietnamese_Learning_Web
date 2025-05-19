package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.model.Progress;
import group3.vietnamese_learning_web.model.User;
import group3.vietnamese_learning_web.repository.ProgressRepository;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressRepository progressRepository;

    @PostMapping("/complete")
    public String markLessonComplete(@RequestParam("topicId") int topicId,
                                     @RequestParam("lessonId") int lessonId,
                                     HttpSession session) {

        User user = (User) session.getAttribute("currentUser");
        if (user == null) return "User not logged in";

        int uId = user.getUId();

        Progress existing = progressRepository.findByUIdAndTopicIdAndLessonId(uId, topicId, lessonId);
        if (existing == null) {
            Progress newProgress = new Progress(uId, topicId, lessonId, 100,
                    Progress.Status.Completed, LocalDateTime.now());
            progressRepository.save(newProgress);
        } else {
            existing.setStatus(Progress.Status.Completed);
            existing.setScore(100);
            existing.setLastUpdated(LocalDateTime.now());
            progressRepository.save(existing);
        }

        return "Saved";
    }
}
