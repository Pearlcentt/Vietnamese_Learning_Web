package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.model.Progress;
import group3.vietnamese_learning_web.model.ProgressId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProgressRepository extends JpaRepository<Progress, ProgressId> {
    List<Progress> findByIdUid(Integer uid);

    List<Progress> findByIdUidAndIdTopicId(Integer uid, Integer topicId);

    Optional<Progress> findByIdUidAndIdTopicIdAndIdLessonId(Integer uid, Integer topicId, Integer lessonId);

    long countByIdUidAndStatus(Integer uid, String status);

    long countByIdUidAndIdTopicIdAndStatus(Integer uid, Integer topicId, String status);

    @Query(value = "SELECT DISTINCT DATE(last_updated) FROM progress WHERE u_id = :uid", nativeQuery = true)
    List<Date> findDistinctProgressDatesByUid(@Param("uid") Integer uid);

    @Query("SELECT COALESCE(SUM(p.score), 0) FROM Progress p WHERE p.id.uid = :uid")
    Integer sumScoresByUserId(@Param("uid") Integer uid);

    @Query("SELECT p.id.uid, COALESCE(SUM(p.score), 0) FROM Progress p GROUP BY p.id.uid")
    List<Object[]> sumScoresGroupByUserId();
}
