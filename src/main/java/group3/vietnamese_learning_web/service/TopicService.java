package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.TopicProgressDTO;
import group3.vietnamese_learning_web.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TopicService {

    @Autowired
    private TopicRepository topicRepository;

    public List<TopicProgressDTO> getTopicsWithProgress(int userId) {
        return topicRepository.findAllWithProgressByUserId(userId);
    }
}
