
package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.QuestionDTO;
import group3.vietnamese_learning_web.exception.ResourceNotFoundException;
import group3.vietnamese_learning_web.model.Lesson;
import group3.vietnamese_learning_web.model.Question;
import group3.vietnamese_learning_web.model.Test;
import group3.vietnamese_learning_web.repository.LessonRepository;
import group3.vietnamese_learning_web.repository.QuestionRepository;
import group3.vietnamese_learning_web.repository.TestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final LessonRepository lessonRepository;
    private final TestRepository testRepository;

    public List<QuestionDTO> findAll() {
        return questionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public QuestionDTO findById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        return toDTO(question);
    }

    public List<QuestionDTO> findByLessonId(Long lessonId) {
        return questionRepository.findByLessonId(lessonId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<QuestionDTO> findByTestId(Long testId) {
        return questionRepository.findByTestId(testId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public QuestionDTO createQuestion(QuestionDTO dto) {
        Question question = Question.builder()
                .content(dto.getContent())
                .type(dto.getType())
                .options(dto.getOptions())
                .correctAnswer(dto.getCorrectAnswer())
                .audioUrl(dto.getAudioUrl())
                .build();
        
        if (dto.getLessonId() != null) {
            Lesson lesson = lessonRepository.findById(dto.getLessonId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + dto.getLessonId()));
            question.setLesson(lesson);
        }
        
        if (dto.getTestId() != null) {
            Test test = testRepository.findById(dto.getTestId())
                    .orElseThrow(() -> new ResourceNotFoundException("Test not found with id: " + dto.getTestId()));
            question.setTest(test);
        }
        
        return toDTO(questionRepository.save(question));
    }

    @Transactional
    public QuestionDTO updateQuestion(Long id, QuestionDTO dto) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        
        question.setContent(dto.getContent());
        question.setType(dto.getType());
        question.setOptions(dto.getOptions());
        question.setCorrectAnswer(dto.getCorrectAnswer());
        question.setAudioUrl(dto.getAudioUrl());
        
        if (dto.getLessonId() != null) {
            Lesson lesson = lessonRepository.findById(dto.getLessonId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + dto.getLessonId()));
            question.setLesson(lesson);
        } else {
            question.setLesson(null);
        }
        
        if (dto.getTestId() != null) {
            Test test = testRepository.findById(dto.getTestId())
                    .orElseThrow(() -> new ResourceNotFoundException("Test not found with id: " + dto.getTestId()));
            question.setTest(test);
        } else {
            question.setTest(null);
        }
        
        return toDTO(questionRepository.save(question));
    }

    @Transactional
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Question not found with id: " + id);
        }
        questionRepository.deleteById(id);
    }

    private QuestionDTO toDTO(Question question) {
        return QuestionDTO.builder()
                .id(question.getId())
                .content(question.getContent())
                .type(question.getType())
                .options(question.getOptions())
                .correctAnswer(question.getCorrectAnswer())
                .lessonId(question.getLesson() != null ? question.getLesson().getId() : null)
                .testId(question.getTest() != null ? question.getTest().getId() : null)
                .audioUrl(question.getAudioUrl())
                .build();
    }
}