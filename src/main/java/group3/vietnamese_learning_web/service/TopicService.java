package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.TopicProgressDTO;
import group3.vietnamese_learning_web.model.Topic;
import group3.vietnamese_learning_web.repository.TopicRepository;
import group3.vietnamese_learning_web.repository.LessonRepository;
import group3.vietnamese_learning_web.repository.ProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TopicService {
    private final TopicRepository topicRepository;
    private final LessonRepository lessonRepository;
    private final ProgressRepository progressRepository;

    // Get all topics
    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    // Get topic by ID
    public Topic getTopic(Integer topicId) {
        return topicRepository.findById(topicId).orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    // Search topics by keyword (name)
    public List<Topic> searchTopics(String keyword) {
        return topicRepository.findByTopicNameContainingIgnoreCase(keyword);
    }

    // Dashboard: get all topics with progress for a user
    public List<TopicProgressDTO> getTopicProgressByUser(Integer uId) {
        List<Topic> topics = topicRepository.findAll();
        return topics.stream().map(topic -> {
            int total = (int) lessonRepository.countByIdTopicId(topic.getTopicId());
            int completed = (int) progressRepository.countByIdUidAndIdTopicIdAndStatus(uId, topic.getTopicId(), group3.vietnamese_learning_web.model.ProgressStatus.Completed);
            return TopicProgressDTO.builder()
                    .topicId(topic.getTopicId())
                    .topicName(topic.getTopicName())
                    .description(topic.getDescription())
                    .totalLessons(total)
                    .completedLessons(completed)
                    .build();
        }).collect(Collectors.toList());
    }
}
