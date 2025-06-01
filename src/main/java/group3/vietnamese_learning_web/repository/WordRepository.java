package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WordRepository extends JpaRepository<Word, Integer> {
    List<Word> findBySIdOrderByIdxAsc(Integer sId);
}
