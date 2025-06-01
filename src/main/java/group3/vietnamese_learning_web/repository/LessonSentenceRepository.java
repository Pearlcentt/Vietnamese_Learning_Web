package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.model.LessonSentence;
import group3.vietnamese_learning_web.model.LessonSentenceId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LessonSentenceRepository extends JpaRepository<LessonSentence, LessonSentenceId> {
    List<LessonSentence> findByIdTopicIdAndIdLessonId(Integer topicId, Integer lessonId);
}
