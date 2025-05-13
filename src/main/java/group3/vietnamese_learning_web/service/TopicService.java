package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.TopicDTO;
import group3.vietnamese_learning_web.exception.ResourceNotFoundException;
import group3.vietnamese_learning_web.model.Topic;
import group3.vietnamese_learning_web.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TopicService {
    private final TopicRepository topicRepository;

    public List<TopicDTO> findAll() {
        return topicRepository.findAllByOrderByOrderAsc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TopicDTO findById(Long id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + id));
        return toDTO(topic);
    }

    @Transactional
    public TopicDTO createTopic(TopicDTO dto) {
        Topic topic = Topic.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .order(dto.getOrder())
                .difficulty(dto.getDifficulty())
                .build();
        
        return toDTO(topicRepository.save(topic));
    }

    @Transactional
    public TopicDTO updateTopic(Long id, TopicDTO dto) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + id));
        
        topic.setName(dto.getName());
        topic.setDescription(dto.getDescription());
        topic.setOrder(dto.getOrder());
        topic.setDifficulty(dto.getDifficulty());
        
        return toDTO(topicRepository.save(topic));
    }

    @Transactional
    public void deleteTopic(Long id) {
        if (!topicRepository.existsById(id)) {
            throw new ResourceNotFoundException("Topic not found with id: " + id);
        }
        topicRepository.deleteById(id);
    }

    private TopicDTO toDTO(Topic topic) {
        return TopicDTO.builder()
                .id(topic.getId())
                .name(topic.getName())
                .description(topic.getDescription())
                .order(topic.getOrder())
                .difficulty(topic.getDifficulty())
                .build();
    }
}