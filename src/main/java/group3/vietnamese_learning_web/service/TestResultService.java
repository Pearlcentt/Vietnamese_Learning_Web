package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.TestResultDTO;
import group3.vietnamese_learning_web.exception.ResourceNotFoundException;
import group3.vietnamese_learning_web.model.Badge;
import group3.vietnamese_learning_web.model.Student;
import group3.vietnamese_learning_web.model.Test;
import group3.vietnamese_learning_web.model.TestResult;
import group3.vietnamese_learning_web.repository.BadgeRepository;
import group3.vietnamese_learning_web.repository.StudentRepository;
import group3.vietnamese_learning_web.repository.TestRepository;
import group3.vietnamese_learning_web.repository.TestResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestResultService {
    private final TestResultRepository testResultRepository;
    private final StudentRepository studentRepository;
    private final TestRepository testRepository;
    private final BadgeRepository badgeRepository;
    private final StudentService studentService;

    public List<TestResultDTO> findAll() {
        return testResultRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TestResultDTO findById(Long id) {
        TestResult testResult = testResultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test result not found with id: " + id));
        return toDTO(testResult);
    }

    public List<TestResultDTO> findByStudentId(Long studentId) {
        return testResultRepository.findByStudentId(studentId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TestResultDTO findByStudentIdAndTestId(Long studentId, Long testId) {
        TestResult testResult = testResultRepository.findByStudentIdAndTestId(studentId, testId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Test result not found for student id: " + studentId + " and test id: " + testId));
        return toDTO(testResult);
    }

    @Transactional
    public TestResultDTO saveTestResult(TestResultDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + dto.getStudentId()));
        
        Test test = testRepository.findById(dto.getTestId())
                .orElseThrow(() -> new ResourceNotFoundException("Test not found with id: " + dto.getTestId()));
        
        // Calculate if the test is passed
        boolean isPassed = dto.getScore() >= test.getPassingThreshold();
        
        TestResult testResult = TestResult.builder()
                .student(student)
                .test(test)
                .score(dto.getScore())
                .correctAnswers(dto.getCorrectAnswers())
                .totalQuestions(dto.getTotalQuestions())
                .completedAt(LocalDateTime.now())
                .completionTimeInSeconds(dto.getCompletionTimeInSeconds())
                .passed(isPassed)
                .build();
        
        testResult = testResultRepository.save(testResult);

        // If passed, award points to the student
        if (isPassed) {
            int pointsToAdd = 10 + (int)(dto.getScore() * 10); // Base points + bonus based on score
            studentService.addPoints(student.getId(), pointsToAdd);
            
            // Award badges if applicable
            awardBadgesIfApplicable(student.getId(), test.getId(), dto.getScore());
        }
        
        return toDTO(testResult);
    }

    private void awardBadgesIfApplicable(Long studentId, Long testId, Double score) {
        // Example badge logic - different applications might have different criteria
        
        // Perfect score badge
        if (score >= 100.0) {
            Badge perfectScoreBadge = badgeRepository.findByName("Perfect Score");
            if (perfectScoreBadge != null) {
                studentService.addBadge(studentId, perfectScoreBadge.getId());
            }
        }
        
        // Advanced learner badge (score > 90%)
        if (score >= 90.0) {
            Badge advancedBadge = badgeRepository.findByName("Advanced Learner");
            if (advancedBadge != null) {
                studentService.addBadge(studentId, advancedBadge.getId());
            }
        }
        
        // Additional criteria could be added based on completion time, streak, etc.
    }

    @Transactional
    public void deleteTestResult(Long id) {
        if (!testResultRepository.existsById(id)) {
            throw new ResourceNotFoundException("Test result not found with id: " + id);
        }
        testResultRepository.deleteById(id);
    }

    private TestResultDTO toDTO(TestResult testResult) {
        return TestResultDTO.builder()
                .id(testResult.getId())
                .studentId(testResult.getStudent().getId())
                .testId(testResult.getTest().getId())
                .score(testResult.getScore())
                .correctAnswers(testResult.getCorrectAnswers())
                .totalQuestions(testResult.getTotalQuestions())
                .completedAt(testResult.getCompletedAt())
                .completionTimeInSeconds(testResult.getCompletionTimeInSeconds())
                .passed(testResult.getPassed())
                .build();
    }
}