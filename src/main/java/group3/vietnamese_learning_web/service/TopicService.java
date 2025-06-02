package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.constants.ProgressStatus;
import group3.vietnamese_learning_web.dto.TopicProgressDTO;
import group3.vietnamese_learning_web.dto.TopicWithLessonsProgressDTO;
import group3.vietnamese_learning_web.dto.LessonProgressDetailDTO;
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
    private final LessonService lessonService;

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
            int completed = (int) progressRepository.countByIdUidAndIdTopicIdAndStatus(uId, topic.getTopicId(),
                    ProgressStatus.Completed);
            return TopicProgressDTO.builder()
                    .topicId(topic.getTopicId())
                    .topicName(topic.getTopicName())
                    .description(topic.getDescription())
                    .totalLessons(total)
                    .completedLessons(completed)
                    .build();
        }).collect(Collectors.toList());
    } // Dashboard: get all topics with lesson-level progress for a user

    public List<TopicWithLessonsProgressDTO> getTopicsWithLessonsProgress(Integer uId) {
        List<Topic> topics = topicRepository.findAll();
        System.out.println("DEBUG TopicService: Found " + topics.size() + " topics for user " + uId);

        return topics.stream().map(topic -> {
            int total = (int) lessonRepository.countByIdTopicId(topic.getTopicId());
            int completed = (int) progressRepository.countByIdUidAndIdTopicIdAndStatus(uId, topic.getTopicId(),
                    ProgressStatus.Completed);

            System.out.println("DEBUG TopicService: Topic " + topic.getTopicId() + " - Total lessons: " + total
                    + ", Completed: " + completed);

            // Get detailed lesson progress for this topic
            List<LessonProgressDetailDTO> lessons = lessonService.getLessonsWithDetailedProgress(topic.getTopicId(),
                    uId);

            System.out.println(
                    "DEBUG TopicService: Topic " + topic.getTopicId() + " - Found " + lessons.size() + " lessons");

            // Calculate topic progress percentage based on lesson progress
            double topicProgressPercentage = 0.0;
            if (!lessons.isEmpty()) {
                double totalLessonProgress = lessons.stream()
                        .mapToDouble(LessonProgressDetailDTO::getProgressPercentage)
                        .sum();
                topicProgressPercentage = totalLessonProgress / lessons.size();
                System.out.println("DEBUG TopicService: Topic " + topic.getTopicId() + " - Calculated progress: "
                        + topicProgressPercentage + "%");
            }

            return TopicWithLessonsProgressDTO.builder()
                    .topicId(topic.getTopicId())
                    .topicName(topic.getTopicName())
                    .description(topic.getDescription())
                    .totalLessons(total)
                    .completedLessons(completed)
                    .progressPercentage(topicProgressPercentage)
                    .lessons(lessons)
                    .build();
        }).collect(Collectors.toList());
    }

    // Calculate overall progress percentage across all topics for a user
    public double calculateOverallProgress(Integer uId) {
        List<TopicWithLessonsProgressDTO> topics = getTopicsWithLessonsProgress(uId);
        if (topics.isEmpty()) {
            return 0.0;
        }

        double totalProgress = topics.stream()
                .mapToDouble(TopicWithLessonsProgressDTO::getProgressPercentage)
                .sum();

        return totalProgress / topics.size();
    }
}
