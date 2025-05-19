package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.dto.LessonWithProgressDTO;
import group3.vietnamese_learning_web.model.Lesson;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {

    @Query("""
        SELECT new group3.vietnamese_learning_web.dto.LessonWithProgressDTO(
            l.lessonId, l.topicId, l.lessonType,
            COALESCE(p.status, 'Not_Started')
        )
        FROM group3.vietnamese_learning_web.model.Lesson l
        LEFT JOIN group3.vietnamese_learning_web.model.Progress p
            ON p.lessonId = l.lessonId AND p.topicId = l.topicId AND p.uId = :userId
        WHERE l.topicId = :topicId
        ORDER BY l.lessonId
    """)
    List<LessonWithProgressDTO> findLessonsWithProgress(@Param("topicId") int topicId, @Param("userId") int userId);



    @Query("SELECT l FROM Lesson l WHERE l.lessonId = :lessonId AND l.topicId = :topicId")
    Lesson findLessonByTopicAndLessonId(@Param("lessonId") int lessonId, @Param("topicId") int topicId);
}
