package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.model.Progress;
import group3.vietnamese_learning_web.model.ProgressId;
import group3.vietnamese_learning_web.model.ProgressStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProgressRepository extends JpaRepository<Progress, ProgressId> {
    List<Progress> findByIdUid(Integer uid);
    List<Progress> findByIdUidAndIdTopicId(Integer uid, Integer topicId);
    Optional<Progress> findByIdUidAndIdTopicIdAndIdLessonId(Integer uid, Integer topicId, Integer lessonId);
    long countByIdUidAndStatus(Integer uid, ProgressStatus status);
    long countByIdUidAndIdTopicIdAndStatus(Integer uid, Integer topicId, ProgressStatus status);

    @Query("SELECT DISTINCT DATE(p.lastUpdated) FROM Progress p WHERE p.id.uid = :uid")
    List<Timestamp> findDistinctProgressDatesByUid(@Param("uid") Integer uid);
}
