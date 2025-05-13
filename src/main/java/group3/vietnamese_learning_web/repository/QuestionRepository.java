package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByLessonId(Long lessonId);
    List<Question> findByTestId(Long testId);
}