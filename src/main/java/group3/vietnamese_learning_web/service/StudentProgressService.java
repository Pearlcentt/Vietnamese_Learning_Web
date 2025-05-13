package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.StudentProgressDTO;
import group3.vietnamese_learning_web.exception.ResourceNotFoundException;
import group3.vietnamese_learning_web.model.Lesson;
import group3.vietnamese_learning_web.model.Student;
import group3.vietnamese_learning_web.model.StudentProgress;
import group3.vietnamese_learning_web.model.Topic;
import group3.vietnamese_learning_web.repository.LessonRepository;
import group3.vietnamese_learning_web.repository.StudentProgressRepository;
import group3.vietnamese_learning_web.repository.StudentRepository;
import group3.vietnamese_learning_web.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentProgressService {
    private final StudentProgressRepository studentProgressRepository;
    private final StudentRepository studentRepository;
    private final LessonRepository lessonRepository;
    private final TopicRepository topicRepository;
    private final StudentService studentService;

    public List<StudentProgressDTO> findByStudentId(Long studentId) {
        return studentProgressRepository.findByStudentId(studentId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<StudentProgressDTO> findByStudentIdAndTopicId(Long studentId, Long topicId) {
        return studentProgressRepository.findByStudentIdAndTopicId(studentId, topicId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public StudentProgressDTO findByStudentIdAndLessonId(Long studentId, Long lessonId) {
        StudentProgress progress = studentProgressRepository.findByStudentIdAndLessonId(studentId, lessonId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Progress not found for student id: " + studentId + " and lesson id: " + lessonId));
        return toDTO(progress);
    }

    public Double getAverageProgressForTopic(Long studentId, Long topicId) {
        return studentProgressRepository.getAverageProgressForTopic(studentId, topicId);
    }

    public Long countCompletedLessons(Long studentId) {
        return studentProgressRepository.countCompletedLessons(studentId);
    }

    @Transactional
    public StudentProgressDTO saveProgress(StudentProgressDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + dto.getStudentId()));
        
        // Determine if this is an update to existing progress or new progress
        StudentProgress progress;
        boolean isNewProgress = false;
        
        if (dto.getLessonId() != null) {
            // Try to find existing progress for this lesson
            progress = studentProgressRepository.findByStudentIdAndLessonId(student.getId(), dto.getLessonId())
                    .orElse(null);
            
            if (progress == null) {
                isNewProgress = true;
                Lesson lesson = lessonRepository.findById(dto.getLessonId())
                        .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + dto.getLessonId()));
                
                progress = StudentProgress.builder()
                        .student(student)
                        .lesson(lesson)
                        .scorePercentage(dto.getScorePercentage())
                        .lastAttemptDate(LocalDateTime.now())
                        .completed(dto.getCompleted())
                        .build();
            } else {
                // Update existing progress
                progress.setScorePercentage(dto.getScorePercentage());
                progress.setLastAttemptDate(LocalDateTime.now());
                progress.setCompleted(dto.getCompleted());
            }
        } else if (dto.getTopicId() != null) {
            // This is topic-level progress
            Topic topic = topicRepository.findById(dto.getTopicId())
                    .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + dto.getTopicId()));
            
            progress = StudentProgress.builder()
                    .student(student)
                    .topic(topic)
                    .scorePercentage(dto.getScorePercentage())
                    .lastAttemptDate(LocalDateTime.now())
                    .completed(dto.getCompleted())
                    .build();
            
            isNewProgress = true;
        } else {
            throw new IllegalArgumentException("Either lessonId or topicId must be provided");
        }
        
        progress = studentProgressRepository.save(progress);
        
        // Award points for completed lessons/topics if it's new progress or first completion
        if (isNewProgress && Boolean.TRUE.equals(dto.getCompleted())) {
            int pointsToAdd = dto.getLessonId() != null ? 5 : 20; // 5 points for lesson, 20 for topic
            studentService.addPoints(student.getId(), pointsToAdd);
            
            // Check for potential badges
            checkAndAwardProgressBadges(student.getId());
        }
        
        return toDTO(progress);
    }

    private void checkAndAwardProgressBadges(Long studentId) {
        // This could check for badges related to progress milestones
        // Example: Count completed lessons and award badges at specific thresholds
        Long completedCount = countCompletedLessons(studentId);
        
        // You would need to implement the logic to check for badge conditions
        // and award them through the StudentService
    }

    @Transactional
    public void deleteProgress(Long id) {
        if (!studentProgressRepository.existsById(id)) {
            throw new ResourceNotFoundException("Progress not found with id: " + id);
        }
        studentProgressRepository.deleteById(id);
    }

    private StudentProgressDTO toDTO(StudentProgress progress) {
        return StudentProgressDTO.builder()
                .id(progress.getId())
                .studentId(progress.getStudent().getId())
                .lessonId(progress.getLesson() != null ? progress.getLesson().getId() : null)
                .topicId(progress.getTopic() != null ? progress.getTopic().getId() : null)
                .scorePercentage(progress.getScorePercentage())
                .lastAttemptDate(progress.getLastAttemptDate())
                .completed(progress.getCompleted())
                .build();
    }
}