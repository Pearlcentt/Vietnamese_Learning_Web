package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.dto.TopicProgressDTO;
import group3.vietnamese_learning_web.model.Topic;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Integer> {

    @Query("""
        SELECT new group3.vietnamese_learning_web.dto.TopicProgressDTO(
            t.topicId, t.topicName, t.description,
            COUNT(DISTINCT l.lessonId),
            SUM(CASE WHEN p.status = 'Completed' THEN 1 ELSE 0 END)
        )
        FROM Topic t
        LEFT JOIN Lesson l ON l.topicId = t.topicId
        LEFT JOIN Progress p ON p.lessonId = l.lessonId AND p.topicId = t.topicId AND p.uId = :userId
        GROUP BY t.topicId, t.topicName, t.description
    """)
    List<TopicProgressDTO> findAllWithProgressByUserId(int userId);
}
