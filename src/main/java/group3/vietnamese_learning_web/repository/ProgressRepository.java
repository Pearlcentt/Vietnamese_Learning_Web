package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.model.Progress;
import group3.vietnamese_learning_web.model.ProgressId;
import group3.vietnamese_learning_web.model.ProgressStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, ProgressId> {
    List<Progress> findByIdUId(Integer uId);
    List<Progress> findByIdUIdAndIdTopicId(Integer uId, Integer topicId);
    Optional<Progress> findByIdUIdAndIdTopicIdAndIdLessonId(Integer uId, Integer topicId, Integer lessonId);
    long countByIdUIdAndStatus(Integer uId, ProgressStatus status);
    long countByIdUIdAndIdTopicIdAndStatus(Integer uId, Integer topicId, ProgressStatus status);
}
