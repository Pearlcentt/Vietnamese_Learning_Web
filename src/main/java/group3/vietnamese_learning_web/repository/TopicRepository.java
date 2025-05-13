package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findAllByOrderByOrderAsc();
}