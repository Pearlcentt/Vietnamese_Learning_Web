package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.LessonDTO;
import group3.vietnamese_learning_web.dto.LessonProgressDetailDTO;
import group3.vietnamese_learning_web.dto.LessonWithProgressDTO;
import group3.vietnamese_learning_web.dto.LessonWithProgressProjection;
import group3.vietnamese_learning_web.model.Lesson;
import group3.vietnamese_learning_web.model.LessonType;
import group3.vietnamese_learning_web.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonService {
    private final LessonRepository lessonRepository;

    public List<LessonDTO> getLessonsByTopicId(Integer topicId) {
        return lessonRepository.findByIdTopicId(topicId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public LessonDTO getLesson(Integer topicId, Integer lessonId) {
        return lessonRepository.findByIdTopicIdAndIdLessonId(topicId, lessonId)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
    }

    public List<LessonDTO> getLessonsByTypeInTopic(Integer topicId, LessonType lessonType) {
        return lessonRepository.findByIdTopicIdAndLessonType(topicId, lessonType)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public long countLessonsByTopic(Integer topicId) {
        return lessonRepository.countByIdTopicId(topicId);
    }

    private LessonDTO toDTO(Lesson lesson) {
        return LessonDTO.builder()
                .topicId(lesson.getId().getTopicId())
                .lessonId(lesson.getId().getLessonId())
                .lessonType(lesson.getLessonType())
                .build();
    }

    public List<LessonWithProgressDTO> getLessonsWithProgress(Integer topicId, Integer userId) {
        List<LessonWithProgressProjection> projections = lessonRepository.findAllWithProgressByTopicIdAndUserId(topicId,
                userId);

        return projections.stream()
                .map(p -> {
                    // Determine if lesson should be locked
                    String actualStatus = determineActualStatus(p, projections);

                    return LessonWithProgressDTO.builder()
                            .topicId(p.getTopicId())
                            .lessonId(p.getLessonId())
                            .lessonType(p.getLessonType())
                            .status(actualStatus)
                            .score(p.getScore())
                            .build();
                })
                .collect(Collectors.toList());
    }

    private String determineActualStatus(LessonWithProgressProjection current,
            List<LessonWithProgressProjection> allLessons) {
        // All lessons are now unlocked to allow free access to any lesson
        if (current.getStatus() != null) {
            // Status is already converted by the query CASE statement
            return current.getStatus();
        }
        return "Not_Started";
    }

    public List<LessonWithProgressDTO> getLessonsWithProgressByType(Integer topicId, Integer userId,
            LessonType lessonType) {
        return getLessonsWithProgress(topicId, userId)
                .stream()
                .filter(lesson -> lesson.getLessonType() == lessonType)
                .collect(Collectors.toList());
    } // Get lessons with detailed progress including score-based completion
      // percentage

    public List<LessonProgressDetailDTO> getLessonsWithDetailedProgress(Integer topicId, Integer userId) {
        List<LessonWithProgressProjection> projections = lessonRepository.findAllWithProgressByTopicIdAndUserId(topicId,
                userId);

        System.out.println("DEBUG LessonService: Found " + projections.size() + " lesson projections for topic "
                + topicId + " and user " + userId);

        return projections.stream()
                .map(p -> {
                    String actualStatus = determineActualStatus(p, projections);
                    Double progressPercentage = calculateLessonProgressPercentage(p, actualStatus);

                    System.out.println("DEBUG LessonService: Lesson " + p.getLessonId() + " - Status: " + actualStatus +
                            ", Score: " + p.getScore() + ", Progress: " + progressPercentage + "%");

                    return LessonProgressDetailDTO.builder()
                            .topicId(p.getTopicId())
                            .lessonId(p.getLessonId())
                            .lessonType(p.getLessonType())
                            .status(actualStatus)
                            .score(p.getScore())
                            .progressPercentage(progressPercentage)
                            .build();
                })
                .collect(Collectors.toList());
    }// Calculate lesson progress percentage based on status and score

    private Double calculateLessonProgressPercentage(LessonWithProgressProjection lesson, String status) {
        if ("Completed".equals(status)) {
            return 100.0;
        } else if ("In_Progress".equals(status) || "Not_Started".equals(status)) {
            // Calculate progress based on actual score from database
            if (lesson.getScore() != null && lesson.getScore() > 0) {
                // Maximum score is 10000 based on the database examples
                double maxScore = 10000.0;
                double percentage = (lesson.getScore() / maxScore) * 100.0;
                // Cap at 99% for In_Progress to distinguish from Completed
                if ("In_Progress".equals(status)) {
                    return Math.min(99.0, percentage);
                } else {
                    return Math.min(100.0, percentage);
                }
            } else {
                return 0.0; // No score means no progress
            }
        } else {
            return 0.0; // Default case
        }
    }
}
