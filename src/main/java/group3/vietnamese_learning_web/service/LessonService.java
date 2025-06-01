package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.LessonDTO;
import group3.vietnamese_learning_web.dto.LessonWithProgressDTO;
import group3.vietnamese_learning_web.dto.LessonWithProgressProjection;
import group3.vietnamese_learning_web.model.Lesson;
import group3.vietnamese_learning_web.model.LessonType;
import group3.vietnamese_learning_web.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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
    }    public List<LessonWithProgressDTO> getLessonsWithProgress(Integer topicId, Integer userId) {
        List<LessonWithProgressProjection> projections = lessonRepository.findAllWithProgressByTopicIdAndUserId(topicId, userId);
        
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
      private String determineActualStatus(LessonWithProgressProjection current, List<LessonWithProgressProjection> allLessons) {
        // All lessons are now unlocked to allow free access to any lesson
        return current.getStatus() != null ? current.getStatus() : "Not_Started";
    }

    public List<LessonWithProgressDTO> getLessonsWithProgressByType(Integer topicId, Integer userId, LessonType lessonType) {
        return getLessonsWithProgress(topicId, userId)
                .stream()
                .filter(lesson -> lesson.getLessonType() == lessonType)
                .collect(Collectors.toList());
    }
}
