package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.model.StudentProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentProgressRepository extends JpaRepository<StudentProgress, Long> {
    List<StudentProgress> findByStudentId(Long studentId);
    List<StudentProgress> findByStudentIdAndTopicId(Long studentId, Long topicId);
    Optional<StudentProgress> findByStudentIdAndLessonId(Long studentId, Long lessonId);
    
    @Query("SELECT AVG(sp.scorePercentage) FROM StudentProgress sp WHERE sp.student.id = :studentId AND sp.topic.id = :topicId")
    Double getAverageProgressForTopic(@Param("studentId") Long studentId, @Param("topicId") Long topicId);
    
    @Query("SELECT COUNT(sp) FROM StudentProgress sp WHERE sp.student.id = :studentId AND sp.completed = true")
    Long countCompletedLessons(@Param("studentId") Long studentId);
}