package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.model.Test;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findByTopicId(Long topicId);
}