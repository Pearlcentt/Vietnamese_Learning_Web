package group3.vietnamese_learning_web.repository;
import group3.vietnamese_learning_web.projection.LessonWithProgressProjection;


import group3.vietnamese_learning_web.model.Lesson;
import group3.vietnamese_learning_web.model.LessonId;
import group3.vietnamese_learning_web.model.LessonType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface LessonRepository extends JpaRepository<Lesson, LessonId> {
    List<Lesson> findByIdTopicId(Integer topicId);
    Optional<Lesson> findByIdTopicIdAndIdLessonId(Integer topicId, Integer lessonId);
    List<Lesson> findByIdTopicIdAndLessonType(Integer topicId, LessonType lessonType);
    long countByIdTopicId(Integer topicId);

    @Query("SELECT l.id.topicId AS topicId, l.id.lessonId AS lessonId, l.lessonType AS lessonType, " +
        "COALESCE(p.status, 'Not_Started') AS status, p.score AS score " +
        "FROM Lesson l LEFT JOIN Progress p " +
        "ON l.id.topicId = p.id.topicId AND l.id.lessonId = p.id.lessonId AND p.id.uid = :userId " +
        "WHERE l.id.topicId = :topicId")
    List<LessonWithProgressProjection> findAllWithProgressByTopicIdAndUserId(@Param("topicId") Integer topicId, @Param("userId") Integer userId);
}
