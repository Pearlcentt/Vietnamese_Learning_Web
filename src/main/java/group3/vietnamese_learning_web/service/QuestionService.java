package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.QuestionDTO;
import group3.vietnamese_learning_web.model.Sentence;
import group3.vietnamese_learning_web.model.Word;
import group3.vietnamese_learning_web.repository.SentenceRepository;
import group3.vietnamese_learning_web.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final SentenceRepository sentenceRepository;
    private final WordRepository wordRepository;

    // Example: Get all questions for a lesson (by sentence IDs)
    public List<QuestionDTO> getQuestionsForLesson(List<Integer> sentenceIds) {
        List<QuestionDTO> questions = new ArrayList<>();
        for (Integer sId : sentenceIds) {
            Sentence sentence = sentenceRepository.findById(sId).orElseThrow(() -> new RuntimeException("Sentence not found"));
            List<Word> words = wordRepository.findBySIdOrderByIdxAsc(sId);
            List<String> wordList = words.stream().map(Word::getEng).collect(Collectors.toList());
            // Shuffle or apply your own logic for question type
            questions.add(QuestionDTO.builder()
                    .sId(sentence.getSId())
                    .eng(sentence.getEng())
                    .viet(sentence.getViet())
                    .words(wordList)
                    .build());
        }
        return questions;
    }
}
