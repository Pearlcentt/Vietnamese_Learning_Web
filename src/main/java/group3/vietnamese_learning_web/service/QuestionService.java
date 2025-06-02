package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.QuestionDTO;
import group3.vietnamese_learning_web.model.Sentence;
import group3.vietnamese_learning_web.model.Word;
import group3.vietnamese_learning_web.repository.SentenceRepository;
import group3.vietnamese_learning_web.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final SentenceRepository sentenceRepository;
    private final WordRepository wordRepository;

    // Data structure to hold lesson data with indexed access
    @Data
    @AllArgsConstructor
    public static class LessonData {
        private List<Sentence> sentences;
        private List<List<Word>> wordsPerSentence;
    }

    public List<QuestionDTO> getQuestionsForLesson(List<Integer> sentenceIds, int lessonType) {
        System.out.println("=== STARTING QUESTION GENERATION ===");
        System.out.println("Input sentence IDs: " + sentenceIds);
        System.out.println("Lesson type: " + lessonType);

        List<QuestionDTO> questions = new ArrayList<>();
        int maxSentences = 10; // Set to 10 sentences maximum

        // Load lesson data with unique sentences only
        LessonData lessonData = loadLessonData(sentenceIds, maxSentences);
        System.out.println("Loaded " + lessonData.getSentences().size() + " unique sentences for lesson");

        // Generate exactly 10 questions using indexing approach
        for (int questionIndex = 0; questionIndex < maxSentences; questionIndex++) {
            System.out.println("\n--- Generating Question " + (questionIndex + 1) + "/10 ---");

            QuestionDTO question = generateQuestionByIndex(lessonData, lessonType, questionIndex);
            if (question != null) {
                questions.add(question);
                System.out.println("Successfully generated question " + (questionIndex + 1) + " for sentence ID: "
                        + question.getSId());
            } else {
                System.out.println("Failed to generate question " + (questionIndex + 1));
            }
        }

        System.out.println("=== COMPLETED: Generated " + questions.size() + " questions ===");
        return questions;
    }

    private LessonData loadLessonData(List<Integer> sentenceIds, int maxSentences) {
        List<Sentence> uniqueSentences = new ArrayList<>();
        List<List<Word>> wordsPerSentence = new ArrayList<>();
        List<Integer> usedSentenceIds = new ArrayList<>();

        // First, add provided sentences (no duplicates)
        for (Integer sid : sentenceIds) {
            if (!usedSentenceIds.contains(sid) && uniqueSentences.size() < maxSentences) {
                Sentence sentence = sentenceRepository.findById(sid).orElse(null);
                if (sentence != null) {
                    uniqueSentences.add(sentence);
                    List<Word> words = wordRepository.findBySidOrderByIdxAsc(sid);
                    wordsPerSentence.add(words);
                    usedSentenceIds.add(sid);
                    System.out.println("Added sentence ID " + sid + " with " + words.size() + " words");
                }
            }
        }

        // If we need more sentences to reach maxSentences, find additional ones from
        // the same topic
        if (uniqueSentences.size() < maxSentences && !sentenceIds.isEmpty()) {
            Integer firstSid = sentenceIds.get(0);
            Sentence firstSentence = sentenceRepository.findById(firstSid).orElse(null);
            if (firstSentence != null) {
                String topicName = firstSentence.getTopicName();
                System.out.println("Looking for additional sentences in topic: " + topicName);

                List<Sentence> allTopicSentences = sentenceRepository.findByTopicName(topicName);
                List<Sentence> candidates = allTopicSentences.stream()
                        .filter(s -> !usedSentenceIds.contains(s.getSId()))
                        .collect(Collectors.toList());

                for (Sentence candidate : candidates) {
                    if (uniqueSentences.size() >= maxSentences) {
                        break;
                    }
                    uniqueSentences.add(candidate);
                    List<Word> words = wordRepository.findBySidOrderByIdxAsc(candidate.getSId());
                    wordsPerSentence.add(words);
                    usedSentenceIds.add(candidate.getSId());
                    System.out.println(
                            "Added additional sentence ID " + candidate.getSId() + " with " + words.size() + " words");
                }
            }
        }

        return new LessonData(uniqueSentences, wordsPerSentence);
    }

    private QuestionDTO generateQuestionByIndex(LessonData lessonData, int lessonType, int questionIndex) {
        if (lessonData.getSentences().isEmpty()) {
            System.out.println("No sentences available for question generation");
            return null;
        }

        // Use modulo to cycle through available sentences
        int sentenceIndex = questionIndex % lessonData.getSentences().size();
        Sentence sentence = lessonData.getSentences().get(sentenceIndex);
        List<Word> words = lessonData.getWordsPerSentence().get(sentenceIndex);

        System.out.println("Using sentence index " + sentenceIndex + " (ID: " + sentence.getSId() + ") for question "
                + (questionIndex + 1));

        switch (lessonType) {
            case 1:
                return buildVocabQuestion(sentence, words, questionIndex);
            case 2:
                return buildFillInBlankQuestion(sentence, words, questionIndex);
            case 3:
                return buildReorderWordQuestion(sentence, words, questionIndex);
            case 4:
                return buildReorderCharQuestion(sentence, words, questionIndex);
            case 5:
                return buildListenAndFillQuestion(sentence, questionIndex);
            default:
                return buildVocabQuestion(sentence, words, questionIndex);
        }
    }

    // Testing method to get a specific question by index
    public QuestionDTO getQuestionByIndex(List<Integer> sentenceIds, int lessonType, int questionIndex) {
        LessonData lessonData = loadLessonData(sentenceIds, 10);
        return generateQuestionByIndex(lessonData, lessonType, questionIndex);
    }

    // --- Individual builders for each lesson type ---

    // Lesson 1: Vocab - English word as question, Vietnamese word as answer
    private QuestionDTO buildVocabQuestion(Sentence sentence, List<Word> words, int questionIndex) {
        System.out.println(
                "Building vocab question for sentence ID: " + sentence.getSId() + ", question index: " + questionIndex);

        // For lesson 1, pick one word from the sentence using deterministic selection
        if (words.isEmpty()) {
            System.out.println("No words available, using full sentence as fallback");
            // Fallback: use full sentence if no words available
            return QuestionDTO.builder()
                    .sId(sentence.getSId())
                    .question(sentence.getEng())
                    .answer(sentence.getViet())
                    .choices(List.of(sentence.getViet()))
                    .type(1)
                    .build();
        }

        // Deterministic word selection based on question index
        int wordIndex = questionIndex % words.size();
        Word targetWord = words.get(wordIndex);
        System.out.println(
                "Selected word at index " + wordIndex + ": " + targetWord.getEng() + " -> " + targetWord.getViet());

        // Create choices: correct answer + similar words
        List<String> choices = new ArrayList<>();
        choices.add(targetWord.getViet()); // Correct answer

        // Add similar words as wrong choices
        List<String> similarWords = targetWord.getVietSimilarWordsList();
        if (similarWords != null) {
            choices.addAll(similarWords);
        }

        // Ensure we have at least 4 choices
        while (choices.size() < 4) {
            choices.add("lựa chọn " + choices.size());
        }

        // Limit to 4 choices and shuffle deterministically
        if (choices.size() > 4) {
            choices = choices.subList(0, 4);
        }

        // Deterministic shuffle using question index as seed
        Random random = new Random(questionIndex);
        Collections.shuffle(choices, random);

        return QuestionDTO.builder()
                .sId(sentence.getSId())
                .question(targetWord.getEng()) // English word as question
                .answer(targetWord.getViet()) // Vietnamese word as answer
                .choices(choices)
                .type(1)
                .build();
    }

    // Lesson 2: Fill in the blank - Vietnamese sentence with one word blanked out
    private QuestionDTO buildFillInBlankQuestion(Sentence sentence, List<Word> words, int questionIndex) {
        System.out.println("Building fill-in-blank question for sentence ID: " + sentence.getSId()
                + ", question index: " + questionIndex);

        if (words.isEmpty()) {
            System.out.println("No words available, using fallback approach");
            // Fallback: use first word from sentence and create a blank
            String originalSentence = sentence.getViet();
            String[] sentenceWords = originalSentence.split("\\s+");
            if (sentenceWords.length > 0) {
                String firstWord = sentenceWords[0];
                String blankedSentence = originalSentence
                        .replaceFirst("\\b" + java.util.regex.Pattern.quote(firstWord) + "\\b", "_____");
                return QuestionDTO.builder()
                        .sId(sentence.getSId())
                        .question(blankedSentence)
                        .answer(firstWord)
                        .choices(List.of(firstWord, "từ 1", "từ 2", "từ 3"))
                        .type(2)
                        .build();
            } else {
                return QuestionDTO.builder()
                        .sId(sentence.getSId())
                        .question("_____ từ thiếu")
                        .answer("từ")
                        .choices(List.of("từ", "từ 1", "từ 2", "từ 3"))
                        .type(2)
                        .build();
            }
        }

        // Deterministic word selection: prefer words with similar words for better
        // choices
        List<Word> candidateWords = words.stream()
                .filter(word -> word.getVietSimilarWordsList() != null && !word.getVietSimilarWordsList().isEmpty())
                .collect(Collectors.toList());

        Word targetWord;
        if (!candidateWords.isEmpty()) {
            int wordIndex = questionIndex % candidateWords.size();
            targetWord = candidateWords.get(wordIndex);
        } else {
            int wordIndex = questionIndex % words.size();
            targetWord = words.get(wordIndex);
        }

        System.out.println("Selected word for blanking: " + targetWord.getViet());

        String originalSentence = sentence.getViet();
        String blankedSentence = createBlankedSentence(originalSentence, words, targetWord);

        // Generate choices deterministically
        List<String> choices = generateChoicesForWord(targetWord, words, questionIndex);

        return QuestionDTO.builder()
                .sId(sentence.getSId())
                .question(blankedSentence)
                .answer(targetWord.getViet())
                .choices(choices)
                .type(2)
                .build();
    }

    // Helper method: Create blanked sentence using word positions
    private String createBlankedSentence(String originalSentence, List<Word> words, Word targetWord) {
        // Try to use word boundaries first
        String blankedSentence = originalSentence
                .replaceFirst("\\b" + java.util.regex.Pattern.quote(targetWord.getViet()) + "\\b", "_____");

        // If replacement didn't work, try without word boundaries
        if (blankedSentence.equals(originalSentence)) {
            blankedSentence = originalSentence.replaceFirst(java.util.regex.Pattern.quote(targetWord.getViet()),
                    "_____");
        }

        // If still no replacement, create a simple pattern
        if (blankedSentence.equals(originalSentence)) {
            blankedSentence = "_____ " + originalSentence;
        }

        return blankedSentence;
    }

    // Helper method: Generate smart choices for a word with deterministic shuffling
    private List<String> generateChoicesForWord(Word targetWord, List<Word> allWords, int questionIndex) {
        List<String> choices = new ArrayList<>();
        choices.add(targetWord.getViet()); // Correct answer

        // Add similar words from the target word
        List<String> similarWords = targetWord.getVietSimilarWordsList();
        if (similarWords != null) {
            choices.addAll(similarWords);
        }

        // If we need more choices, add words from other words in the sentence
        if (choices.size() < 4) {
            allWords.stream()
                    .filter(word -> !word.getWId().equals(targetWord.getWId()))
                    .map(Word::getViet)
                    .distinct()
                    .limit(4 - choices.size())
                    .forEach(choices::add);
        }

        // Ensure we have at least 4 choices
        while (choices.size() < 4) {
            choices.add("từ " + choices.size());
        }

        // Limit to 4 choices
        if (choices.size() > 4) {
            choices = choices.subList(0, 4);
        }

        // Deterministic shuffle using question index as seed
        Random random = new Random(questionIndex);
        Collections.shuffle(choices, random);

        return choices;
    }

    // Lesson 3: Reorder Words - Vietnamese word split into characters and shuffled
    private QuestionDTO buildReorderWordQuestion(Sentence sentence, List<Word> words, int questionIndex) {
        System.out.println("Building reorder word question for sentence ID: " + sentence.getSId() + ", question index: "
                + questionIndex);

        // Use deterministic word selection from the sentence
        String targetWord;
        if (!words.isEmpty()) {
            int wordIndex = questionIndex % words.size();
            targetWord = words.get(wordIndex).getViet();
        } else {
            // Fallback: use first word of the sentence
            String[] sentenceWords = sentence.getViet().split("\\s+");
            int wordIndex = questionIndex % sentenceWords.length;
            targetWord = sentenceWords.length > 0 ? sentenceWords[wordIndex] : sentence.getViet();
        }

        System.out.println("Selected word for character reordering: " + targetWord);

        // Split the Vietnamese word into characters
        List<String> charList = Arrays.stream(targetWord.split(""))
                .collect(Collectors.toList());
        List<String> shuffledChars = new ArrayList<>(charList);

        // Deterministic shuffle using question index as seed
        Random random = new Random(questionIndex);
        Collections.shuffle(shuffledChars, random);

        return QuestionDTO.builder()
                .sId(sentence.getSId())
                .question("Sắp xếp lại các ký tự để tạo thành từ đúng")
                .answer(targetWord)
                .chars(shuffledChars) // Shuffled character list
                .charOrder(charList) // Correct character order
                .type(3)
                .build();
    }

    // Lesson 4: Reorder Sentence - Vietnamese sentence split and shuffled
    private QuestionDTO buildReorderCharQuestion(Sentence sentence, List<Word> words, int questionIndex) {
        System.out.println("Building reorder sentence question for sentence ID: " + sentence.getSId()
                + ", question index: " + questionIndex);

        String vietnameseSentence = sentence.getViet();

        // Split Vietnamese sentence into words
        List<String> wordList = Arrays.asList(vietnameseSentence.split("\\s+"));
        List<String> shuffledWords = new ArrayList<>(wordList);

        // Deterministic shuffle using question index as seed
        Random random = new Random(questionIndex);
        Collections.shuffle(shuffledWords, random);

        return QuestionDTO.builder()
                .sId(sentence.getSId())
                .question("Sắp xếp lại các từ để tạo thành câu đúng")
                .answer(vietnameseSentence)
                .words(shuffledWords) // Shuffled word list for user to reorder
                .correctOrder(wordList) // Correct order
                .type(4)
                .build();
    }

    // Lesson 5: Listen and Fill - Audio of Vietnamese sentence, user types what
    // they hear
    private QuestionDTO buildListenAndFillQuestion(Sentence sentence, int questionIndex) {
        System.out.println("Building listen and fill question for sentence ID: " + sentence.getSId()
                + ", question index: " + questionIndex);

        return QuestionDTO.builder()
                .sId(sentence.getSId())
                .question("Nghe và viết lại những gì bạn nghe được")
                .answer(sentence.getViet()) // Vietnamese sentence to be spoken
                .type(5)
                .build();
    }
}
