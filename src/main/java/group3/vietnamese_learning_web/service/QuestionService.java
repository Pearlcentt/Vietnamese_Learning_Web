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
    private final WordRepository wordRepository;    public List<QuestionDTO> getQuestionsForLesson(List<Integer> sentenceIds, int lessonType) {
        List<QuestionDTO> questions = new ArrayList<>();
        
        // Limit to 2 sentences per lesson as requested
        int maxSentences = Math.min(2, sentenceIds.size());
        
        for (int i = 0; i < maxSentences; i++) {
            Integer sid = sentenceIds.get(i);
            Sentence sentence = sentenceRepository.findById(sid)
                .orElseThrow(() -> new RuntimeException("Sentence not found"));
            List<Word> words = wordRepository.findBySidOrderByIdxAsc(sid);

            switch (lessonType) {
                case 1:
                    questions.add(buildVocabQuestion(sentence, words));
                    break;
                case 2:
                    questions.add(buildFillInBlankQuestion(sentence, words));
                    break;
                case 3:
                    questions.add(buildReorderWordQuestion(sentence, words));
                    break;
                case 4:
                    questions.add(buildReorderCharQuestion(sentence, words));
                    break;
                case 5:
                    questions.add(buildListenAndFillQuestion(sentence));
                    break;
                default:
                    // fallback to generic
                    questions.add(buildVocabQuestion(sentence, words));
            }
        }
        return questions;
    }

    // --- Individual builders for each lesson type ---    // Lesson 1: Vocab
    private QuestionDTO buildVocabQuestion(Sentence sentence, List<Word> words) {
        // Use the Vietnamese translation and similar words from your word structure
        List<String> vietList = words.stream().map(Word::getViet).collect(Collectors.toList());
        List<String> similar = new ArrayList<>();
        for (Word w : words) {
            similar.addAll(w.getVietSimilarWordsList());
        }
        
        // If we have similar words, use them as choices
        List<String> choices = new ArrayList<>();
        if (!similar.isEmpty()) {
            choices.addAll(similar);
            // Add the correct answer
            choices.add(sentence.getViet());
            Collections.shuffle(choices);
        } else {
            // Fallback: use words from the sentence as choices
            choices.addAll(vietList);
            if (choices.size() < 4) {
                choices.add(sentence.getViet());
            }
        }
        
        return QuestionDTO.builder()
                .sId(sentence.getSId())
                .eng(sentence.getEng())
                .viet(sentence.getViet())
                .vietList(vietList)
                .vietSimilarWords(similar)
                .answer(sentence.getViet())
                .choices(choices)
                .type(1)
                .build();
    }// Lesson 2: Fill in the blank
    private QuestionDTO buildFillInBlankQuestion(Sentence sentence, List<Word> words) {
        // Randomly pick a word to blank
        if (words.isEmpty()) return buildVocabQuestion(sentence, words);
        Word target = words.get((int)(Math.random() * words.size()));
        String originalSentence = sentence.getViet();
        String blankedSentence = originalSentence.replaceFirst("\\b" + target.getViet() + "\\b", "_____");
        
        // Create choices including the correct answer and similar words
        List<String> choices = new ArrayList<>();
        choices.add(target.getViet());
        
        // Add similar words if available
        List<String> similarWords = target.getVietSimilarWordsList();
        if (!similarWords.isEmpty()) {
            choices.addAll(similarWords);
        } else {
            // If no similar words, add some random words from other words in the sentence
            words.stream()
                .filter(w -> !w.getViet().equals(target.getViet()))
                .limit(3)
                .forEach(w -> choices.add(w.getViet()));
        }
        
        // Ensure we have at least 4 choices, pad with placeholder if needed
        while (choices.size() < 4) {
            choices.add("option" + choices.size());
        }
        
        Collections.shuffle(choices);
        return QuestionDTO.builder()
                .sId(sentence.getSId())
                .eng(sentence.getEng())
                .viet(sentence.getViet())
                .question(blankedSentence)
                .answer(target.getViet())
                .choices(choices)
                .type(2)
                .build();
    }    // Lesson 3: Reorder Words
    private QuestionDTO buildReorderWordQuestion(Sentence sentence, List<Word> words) {
        List<String> wordList = words.stream().map(Word::getViet).collect(Collectors.toList());
        List<String> shuffled = new ArrayList<>(wordList);
        Collections.shuffle(shuffled);
        
        return QuestionDTO.builder()
                .sId(sentence.getSId())
                .eng(sentence.getEng())
                .viet(sentence.getViet())
                .question(sentence.getEng())
                .answer(sentence.getViet())
                .words(shuffled)
                .correctOrder(wordList)
                .type(3)
                .build();
    }    // Lesson 4: Reorder Chars
    private QuestionDTO buildReorderCharQuestion(Sentence sentence, List<Word> words) {
        // Use the first word as target (or change as needed)
        if (words.isEmpty()) return buildVocabQuestion(sentence, words);
        String word = words.get(0).getViet();
        List<String> chars = word.chars()
            .mapToObj(c -> String.valueOf((char)c))
            .collect(Collectors.toList());
        List<String> shuffled = new ArrayList<>(chars);
        Collections.shuffle(shuffled);
        
        return QuestionDTO.builder()
                .sId(sentence.getSId())
                .eng(sentence.getEng())
                .viet(sentence.getViet())
                .question(sentence.getEng())
                .answer(word)
                .chars(shuffled)
                .charOrder(chars)
                .type(4)
                .build();
    }    // Lesson 5: Listen and Fill
    private QuestionDTO buildListenAndFillQuestion(Sentence sentence) {
        return QuestionDTO.builder()                .sId(sentence.getSId())
                .eng(sentence.getEng())
                .viet(sentence.getViet())
                .answer(sentence.getViet())
                .type(5)
                .build();
    }
}

