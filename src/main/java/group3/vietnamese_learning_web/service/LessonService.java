package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.LessonWithProgressDTO;
import group3.vietnamese_learning_web.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    public List<LessonWithProgressDTO> getLessonsForUserAndTopic(int userId, int topicId) {
        return lessonRepository.findLessonsWithProgress(topicId, userId);
    }
}
