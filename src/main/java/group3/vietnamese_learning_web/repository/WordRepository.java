package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WordRepository extends JpaRepository<Word, Integer> {
    List<Word> findBySId(Integer sId);
}
