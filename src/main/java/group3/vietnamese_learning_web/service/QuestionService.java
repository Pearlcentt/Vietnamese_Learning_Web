package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.model.*;
import group3.vietnamese_learning_web.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QuestionService {

    @Autowired private LessonRepository lessonRepository;
    @Autowired private SentenceRepository sentenceRepository;
    @Autowired private WordRepository wordRepository;

    public Map<String, Object> loadQuestionData(int topicId, int lessonId) {
        Lesson lesson = lessonRepository.findLessonByTopicAndLessonId(lessonId, topicId);
        if (lesson == null) return Collections.emptyMap();

        String lessonType = lesson.getLessonType().name(); // e.g. "Vocab"
        List<Sentence> sentences = new ArrayList<>();

        if (lesson.getSId() != null) {
            String[] ids = lesson.getSId().split(",");
            for (String id : ids) {
                sentenceRepository.findById(Integer.parseInt(id.trim()))
                        .ifPresent(sentences::add);
            }
        }

        // Also load words if needed
        List<Word> words = new ArrayList<>();
        for (Sentence s : sentences) {
            words.addAll(wordRepository.findBySId(s.getSId()));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("lessonType", lessonType);
        result.put("sentences", sentences);
        result.put("words", words);

        return result;
    }
}
