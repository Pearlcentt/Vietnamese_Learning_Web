package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.TestDTO;
import group3.vietnamese_learning_web.dto.QuestionDTO;
import group3.vietnamese_learning_web.exception.ResourceNotFoundException;
import group3.vietnamese_learning_web.model.Test;
import group3.vietnamese_learning_web.model.Topic;
import group3.vietnamese_learning_web.repository.TestRepository;
import group3.vietnamese_learning_web.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestService {
    private final TestRepository testRepository;
    private final TopicRepository topicRepository;
    private final QuestionService questionService;

    public List<TestDTO> findAll() {
        return testRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TestDTO findById(Long id) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found with id: " + id));
        return toDTO(test);
    }

    public List<TestDTO> findByTopicId(Long topicId) {
        return testRepository.findByTopicId(topicId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TestDTO createTest(TestDTO dto) {
        Topic topic = null;
        if (dto.getTopicId() != null) {
            topic = topicRepository.findById(dto.getTopicId())
                    .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + dto.getTopicId()));
        }
        
        Test test = Test.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .passingThreshold(dto.getPassingThreshold())
                .topic(topic)
                .build();
        
        test = testRepository.save(test);
        
        // Save questions with test ID
        if (dto.getQuestions() != null && !dto.getQuestions().isEmpty()) {
            for (QuestionDTO questionDTO : dto.getQuestions()) {
                questionDTO.setTestId(test.getId());
                questionService.createQuestion(questionDTO);
            }
        }
        
        return toDTO(test);
    }

    @Transactional
    public TestDTO updateTest(Long id, TestDTO dto) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found with id: " + id));
        
        test.setName(dto.getName());
        test.setDescription(dto.getDescription());
        test.setPassingThreshold(dto.getPassingThreshold());
        
        if (dto.getTopicId() != null) {
            Topic topic = topicRepository.findById(dto.getTopicId())
                    .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + dto.getTopicId()));
            test.setTopic(topic);
        } else {
            test.setTopic(null);
        }
        
        test = testRepository.save(test);
        
        return toDTO(test);
    }

    @Transactional
    public void deleteTest(Long id) {
        if (!testRepository.existsById(id)) {
            throw new ResourceNotFoundException("Test not found with id: " + id);
        }
        testRepository.deleteById(id);
    }

    private TestDTO toDTO(Test test) {
        List<QuestionDTO> questions = questionService.findByTestId(test.getId());
        
        return TestDTO.builder()
                .id(test.getId())
                .name(test.getName())
                .description(test.getDescription())
                .passingThreshold(test.getPassingThreshold())
                .topicId(test.getTopic() != null ? test.getTopic().getId() : null)
                .questions(Set.copyOf(questions))
                .build();
    }
}