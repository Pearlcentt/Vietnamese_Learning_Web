package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.ProgressDTO;
import group3.vietnamese_learning_web.dto.ProgressUpdateResult;
import group3.vietnamese_learning_web.model.Progress;
import group3.vietnamese_learning_web.model.ProgressId;
import group3.vietnamese_learning_web.model.ProgressStatus;
import group3.vietnamese_learning_web.repository.ProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {
    private final ProgressRepository progressRepository;

    public List<ProgressDTO> getProgressByUser(Integer uid) {
        return progressRepository.findByIdUid(uid)
                .stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProgressDTO> getProgressByUserAndTopic(Integer uid, Integer topicId) {
        return progressRepository.findByIdUidAndIdTopicId(uid, topicId)
                .stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProgressDTO getProgress(Integer uid, Integer topicId, Integer lessonId) {
        return progressRepository.findByIdUidAndIdTopicIdAndIdLessonId(uid, topicId, lessonId)
                .map(this::toDTO)
                .orElse(null);
    }    public ProgressUpdateResult updateProgress(Integer uid, Integer topicId, Integer lessonId, Integer score,
            ProgressStatus status) {
        System.out.println("=== ProgressService.updateProgress called ===");
        System.out.println("uid: " + uid + ", topicId: " + topicId + ", lessonId: " + lessonId);
        System.out.println("score: " + score + ", status: " + status);
        
        // Input validation
        if (uid == null || topicId == null || lessonId == null || score == null || status == null) {
            throw new IllegalArgumentException("All parameters must be non-null");
        }
        
        if (score < 0 || score > 10000) {
            throw new IllegalArgumentException("Score must be between 0 and 10000");
        }
        
        ProgressId id = new ProgressId(uid, topicId, lessonId);
        System.out.println("Created ProgressId: " + id);
        
        Progress progress = progressRepository.findById(id).orElse(null);
        boolean isNewProgress = (progress == null);
        
        if (isNewProgress) {
            progress = Progress.builder().id(id).score(0).status(ProgressStatus.In_Progress).build();
            System.out.println("Created new Progress entity: " + progress);
        } else {
            System.out.println("Found existing Progress entity: " + progress);
        }
        
        // Track what changed
        Integer previousScore = progress.getScore();
        ProgressStatus previousStatus = progress.getStatus();
        boolean scoreUpdated = false;
        boolean statusUpdated = false;
        
        // Only update score if new score is greater than existing score
        if (previousScore == null || score > previousScore) {
            progress.setScore(score);
            scoreUpdated = true;
            System.out.println("Score updated from " + previousScore + " to " + score);
        } else {
            System.out.println("Score not updated. Existing score " + previousScore + " is >= new score " + score);
        }
        
        // Update status with proper logic
        // Once completed, can only stay completed (don't downgrade)
        if (previousStatus != ProgressStatus.Completed || status == ProgressStatus.Completed) {
            if (!status.equals(previousStatus)) {
                progress.setStatus(status);
                statusUpdated = true;
                System.out.println("Status updated from " + previousStatus + " to " + status);
            }
        } else {
            System.out.println("Status not downgraded from Completed to " + status);
        }
        
        Progress saved = progressRepository.save(progress);
        System.out.println("Saved Progress entity: " + saved);
        
        ProgressDTO progressDTO = toDTO(saved);
        System.out.println("Converted to DTO: " + progressDTO);
        
        return ProgressUpdateResult.builder()
                .progress(progressDTO)
                .isNewProgress(isNewProgress)
                .scoreUpdated(scoreUpdated)
                .statusUpdated(statusUpdated)
                .previousScore(previousScore)
                .previousStatus(previousStatus)
                .build();
    }

    // Backward-compatible method for existing code
    public ProgressDTO updateProgressSimple(Integer uid, Integer topicId, Integer lessonId, Integer score,
            ProgressStatus status) {
        ProgressUpdateResult result = updateProgress(uid, topicId, lessonId, score, status);
        return result.getProgress();
    }

    private ProgressDTO toDTO(Progress progress) {
        return ProgressDTO.builder()
                .uid(progress.getId().getUid())
                .topicId(progress.getId().getTopicId())
                .lessonId(progress.getId().getLessonId())
                .score(progress.getScore())
                .status(progress.getStatus())
                .build();
    }
}
