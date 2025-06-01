package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.QuestionDTO;
import group3.vietnamese_learning_web.model.Sentence;
import group3.vietnamese_learning_web.model.Word;
import group3.vietnamese_learning_web.repository.SentenceRepository;
import group3.vietnamese_learning_web.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final SentenceRepository sentenceRepository;
    private final WordRepository wordRepository;

    public List<QuestionDTO> getQuestionsForLesson(List<Integer> sentenceIds, int lessonType) {
        List<QuestionDTO> questions = new ArrayList<>();

        // Limit to 2 sentences per lesson as requested
        int maxSentences = Math.min(2, sentenceIds.size());

        // Ensure we use different sentences by taking different indices
        List<Integer> selectedSentenceIds = new ArrayList<>();
        if (sentenceIds.size() >= 2) {
            // Use first and second sentence if available
            selectedSentenceIds.add(sentenceIds.get(0));
            selectedSentenceIds.add(sentenceIds.get(1));
        } else if (sentenceIds.size() == 1) {
            // If only one sentence, use it twice (fallback)
            selectedSentenceIds.add(sentenceIds.get(0));
            selectedSentenceIds.add(sentenceIds.get(0));
        }

        for (int i = 0; i < maxSentences && i < selectedSentenceIds.size(); i++) {
            Integer sid = selectedSentenceIds.get(i);
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

    // --- Individual builders for each lesson type --- // Lesson 1: Vocab - English
    // word as question, Vietnamese word as answer
    private QuestionDTO buildVocabQuestion(Sentence sentence, List<Word> words) {
        // For lesson 1, pick one word from the sentence
        if (words.isEmpty()) {
            // Fallback: use full sentence if no words available
            return QuestionDTO.builder()
                    .sId(sentence.getSId())
                    .question(sentence.getEng())
                    .answer(sentence.getViet())
                    .choices(List.of(sentence.getViet()))
                    .type(1)
                    .build();
        }

        // Pick the first word (or randomly pick one)
        Word targetWord = words.get(0);

        // Create choices: correct answer + similar words
        List<String> choices = new ArrayList<>();
        choices.add(targetWord.getViet()); // Correct answer

        // Add similar words as wrong choices
        List<String> similarWords = targetWord.getVietSimilarWordsList();
        choices.addAll(similarWords);

        // Ensure we have at least 4 choices
        while (choices.size() < 4) {
            choices.add("lựa chọn " + choices.size());
        }

        // Limit to 4 choices and shuffle
        if (choices.size() > 4) {
            choices = choices.subList(0, 4);
        }
        Collections.shuffle(choices);

        return QuestionDTO.builder()
                .sId(sentence.getSId())
                .question(targetWord.getEng()) // English word as question
                .answer(targetWord.getViet()) // Vietnamese word as answer
                .choices(choices)
                .type(1)
                .build();
    } // Lesson 2: Fill in the blank - Vietnamese sentence with one word blanked out

    private QuestionDTO buildFillInBlankQuestion(Sentence sentence, List<Word> words) {
        if (words.isEmpty()) {
            // Fallback: use full sentence if no words available
            return QuestionDTO.builder()
                    .sId(sentence.getSId())
                    .question(sentence.getViet())
                    .answer(sentence.getViet())
                    .choices(List.of(sentence.getViet()))
                    .type(2)
                    .build();
        }

        // Pick one word to blank out
        Word targetWord = words.get(0);
        String originalSentence = sentence.getViet();
        String blankedSentence = originalSentence.replaceFirst("\\b" + targetWord.getViet() + "\\b", "_____");

        // Create choices: correct answer + similar words
        List<String> choices = new ArrayList<>();
        choices.add(targetWord.getViet()); // Correct answer

        // Add similar words as wrong choices
        List<String> similarWords = targetWord.getVietSimilarWordsList();
        choices.addAll(similarWords);

        // Ensure we have at least 4 choices
        while (choices.size() < 4) {
            choices.add("từ " + choices.size());
        }

        // Limit to 4 choices and shuffle
        if (choices.size() > 4) {
            choices = choices.subList(0, 4);
        }
        Collections.shuffle(choices);

        return QuestionDTO.builder()
                .sId(sentence.getSId())
                .question(blankedSentence) // Vietnamese sentence with blank
                .answer(targetWord.getViet()) // The word that should fill the blank
                .choices(choices)
                .type(2)
                .build();
    } // Lesson 3: Reorder Chars - Vietnamese word split into characters and shuffled

    private QuestionDTO buildReorderWordQuestion(Sentence sentence, List<Word> words) {
        // Use the first word from the sentence, or fallback to first word in sentence
        String targetWord;
        if (!words.isEmpty()) {
            targetWord = words.get(0).getViet();
        } else {
            // Fallback: use first word of the sentence
            String[] sentenceWords = sentence.getViet().split("\\s+");
            targetWord = sentenceWords.length > 0 ? sentenceWords[0] : sentence.getViet();
        }

        // Split word into characters
        List<String> charList = targetWord.chars()
                .mapToObj(c -> String.valueOf((char) c))
                .collect(Collectors.toList());
        List<String> shuffledChars = new ArrayList<>(charList);
        Collections.shuffle(shuffledChars);

        return QuestionDTO.builder()
                .sId(sentence.getSId())
                .question("Sắp xếp lại các ký tự để tạo thành từ đúng")
                .answer(targetWord)
                .chars(shuffledChars) // Shuffled character list
                .charOrder(charList) // Correct character order
                .type(3)
                .build();
    } // Lesson 4: Reorder Words - Vietnamese sentence split and shuffled

    private QuestionDTO buildReorderCharQuestion(Sentence sentence, List<Word> words) {
        String vietnameseSentence = sentence.getViet();

        // Split Vietnamese sentence into words
        List<String> wordList = Arrays.asList(vietnameseSentence.split("\\s+"));
        List<String> shuffledWords = new ArrayList<>(wordList);
        Collections.shuffle(shuffledWords);

        return QuestionDTO.builder()
                .sId(sentence.getSId())
                .question("Sắp xếp lại các từ để tạo thành câu đúng")
                .answer(vietnameseSentence)
                .words(shuffledWords) // Shuffled word list for user to reorder
                .correctOrder(wordList) // Correct order
                .type(4)
                .build();
    } // Lesson 5: Listen and Fill - Audio of Vietnamese sentence, user types what
      // they hear

    private QuestionDTO buildListenAndFillQuestion(Sentence sentence) {
        return QuestionDTO.builder()
                .sId(sentence.getSId())
                .question("Nghe và viết lại những gì bạn nghe được")
                .answer(sentence.getViet()) // Vietnamese sentence to be spoken
                .type(5)
                .build();
    }
}
