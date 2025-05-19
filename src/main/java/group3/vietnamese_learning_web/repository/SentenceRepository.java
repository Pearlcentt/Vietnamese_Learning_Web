package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.model.Sentence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SentenceRepository extends JpaRepository<Sentence, Integer> {
}
