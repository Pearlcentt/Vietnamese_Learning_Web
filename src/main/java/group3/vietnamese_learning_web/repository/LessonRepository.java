package group3.vietnamese_learning_web.repository;
import group3.vietnamese_learning_web.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
}
