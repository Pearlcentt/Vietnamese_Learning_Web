package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.model.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByStudentId(Long studentId);
    List<TestResult> findByTestId(Long testId);
    Optional<TestResult> findByStudentIdAndTestId(Long studentId, Long testId);
}