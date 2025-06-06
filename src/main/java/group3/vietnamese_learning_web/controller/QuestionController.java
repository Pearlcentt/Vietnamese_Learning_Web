package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.QuestionDTO;
import group3.vietnamese_learning_web.dto.UserResponseDTO;
import group3.vietnamese_learning_web.dto.LessonDTO;
import group3.vietnamese_learning_web.model.LessonSentence;
import group3.vietnamese_learning_web.repository.LessonSentenceRepository;
import group3.vietnamese_learning_web.service.QuestionService;
import group3.vietnamese_learning_web.service.AuthService;
import group3.vietnamese_learning_web.service.LessonService;
import lombok.RequiredArgsConstructor;
import group3.vietnamese_learning_web.model.Sentence;
import group3.vietnamese_learning_web.repository.SentenceRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import group3.vietnamese_learning_web.repository.TopicRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;
    private final AuthService authService;
    private final LessonService lessonService;
    private final LessonSentenceRepository lessonSentenceRepository;
    private final SentenceRepository sentenceRepository;
    private final TopicRepository topicRepository; // Inject TopicRepository

    // API endpoint for getting questions (for AJAX calls)
    @GetMapping("/api/lesson")
    @ResponseBody
    public List<QuestionDTO> getQuestionsForLesson(
            @RequestParam List<Integer> sentenceIds,
            @RequestParam int lessonType) {
        return questionService.getQuestionsForLesson(sentenceIds, lessonType);
    }

    // New endpoint for Topic Test
    @GetMapping("/test/start/{topicId}")
    public String startTopicTest(
            @PathVariable Integer topicId,
            Model model) {

        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);

        try {
            // Get topic name from topicId
            String topicName = topicRepository.findById(topicId)
                    .orElseThrow(() -> new RuntimeException("Topic not found"))
                    .getTopicName();

            // Get all sentences for this topic
            List<Sentence> topicSentences = sentenceRepository.findByTopicName(topicName);

            if (topicSentences.isEmpty()) {
                model.addAttribute("error", "No sentences found for this topic.");
                return "error";
            }

            List<QuestionDTO> allQuestions = new ArrayList<>();
            List<Integer> questionTypes = List.of(1, 2, 3, 4, 5); // All question types

            // Generate questions for each sentence and each question type
            for (Sentence sentence : topicSentences) {
                List<Integer> sentenceIdList = Collections.singletonList(sentence.getSId());
                for (Integer type : questionTypes) {
                    // questionService.getQuestionsForLesson expects a list of sentence IDs
                    // and a single lesson type. We call it for each sentence and each type.
                    List<QuestionDTO> questionsForSentenceAndType = questionService
                            .getQuestionsForLesson(sentenceIdList, type);
                    allQuestions.addAll(questionsForSentenceAndType);
                }
            }

            // Shuffle the questions for a mixed test
            Collections.shuffle(allQuestions);

            if (allQuestions.isEmpty()) {
                model.addAttribute("error", "No questions could be generated for this topic test.");
                return "error";
            }

            // For now, pass all questions and the type of the first question
            // Frontend JavaScript will need to handle question progression
            model.addAttribute("questions", allQuestions);
            model.addAttribute("currentQuestion", allQuestions.get(0)); // Pass the first question
            model.addAttribute("questionType", allQuestions.get(0).getType()); // Pass the type of the first question
            model.addAttribute("user", user);
            model.addAttribute("topicId", topicId);
            model.addAttribute("totalQuestions", allQuestions.size()); // Pass total number of questions

            return "topic-test"; // Return the new combined template

        } catch (Exception e) {
            model.addAttribute("error", "Failed to load topic test: " + e.getMessage());
            e.printStackTrace(); // Print stack trace for debugging
            return "error";
        }
    }

    @GetMapping("/{topicId}/{lessonId}")
    public String showQuestion(
            @PathVariable Integer topicId,
            @PathVariable Integer lessonId,
            @RequestParam(required = false) Integer lessonType,
            @RequestParam(defaultValue = "0") Integer questionIndex, // Add question index parameter
            Model model) {

        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);

        // Get lesson details to determine the correct lesson type
        try {
            LessonDTO lesson = lessonService.getLesson(topicId, lessonId); // Use lesson type from database, or from
                                                                           // parameter if provided
            int actualLessonType = lessonType != null ? lessonType : lesson.getLessonType().ordinal() + 1;

            // Get sentences for this lesson (database now always returns 10 sentences)
            List<LessonSentence> lessonSentences = lessonSentenceRepository
                    .findByIdTopicIdAndIdLessonId(topicId, lessonId);

            System.out
                    .println("DEBUG: Looking for lesson sentences with topicId=" + topicId + ", lessonId=" + lessonId);
            System.out.println("DEBUG: Found " + lessonSentences.size() + " lesson sentences");

            if (lessonSentences.isEmpty()) {
                System.out.println("DEBUG: No lesson sentences found, returning error");
                model.addAttribute("error",
                        "No questions found for this lesson. TopicId=" + topicId + ", LessonId=" + lessonId);
                return "error";
            }

            // Get sentence IDs
            List<Integer> sentenceIds = lessonSentences.stream()
                    .map(ls -> ls.getId().getSId())
                    .collect(Collectors.toList());

            // Generate questions based on actual lesson type
            List<QuestionDTO> questions = questionService.getQuestionsForLesson(sentenceIds, actualLessonType);

            // Validate question index
            if (questionIndex < 0 || questionIndex >= questions.size()) {
                questionIndex = 0; // Default to first question if invalid
            }

            // Get the current question
            QuestionDTO currentQuestion = questions.get(questionIndex);

            // Add data to model
            model.addAttribute("questions", questions);
            model.addAttribute("sentences", questions); // For backward compatibility with templates
            model.addAttribute("currentQuestion", currentQuestion); // Add current question
            model.addAttribute("currentQuestionIndex", questionIndex); // Add current question index
            model.addAttribute("user", user);
            model.addAttribute("topicId", topicId);
            model.addAttribute("lessonId", lessonId);
            model.addAttribute("lessonType", actualLessonType);
            model.addAttribute("lesson", lesson);
            model.addAttribute("totalQuestions", questions.size()); // Use actual questions size // Add type-specific
                                                                    // data to templates using the current question
            if (currentQuestion != null) {
                // For qtype1 (vocab) - needs WordChoice wrapper for words
                if (actualLessonType == 1 && currentQuestion.getChoices() != null) {
                    List<WordChoice> words = currentQuestion.getChoices().stream()
                            .map(choice -> new WordChoice(choice))
                            .collect(Collectors.toList());
                    model.addAttribute("words", words);
                }
                // For qtype2 (fill in blank) - translate English question to Vietnamese
                // Uses currentQuestion.question (Vietnamese sentence with blank)
                // Uses currentQuestion.choices (Vietnamese word options)
                // Uses currentQuestion.answer (correct Vietnamese word)
                if (actualLessonType == 2) {
                    // Data is already prepared by QuestionService.buildFillInBlankQuestion()
                    // Add explicit attributes for template clarity
                    model.addAttribute("questionText", currentQuestion.getQuestion());
                    model.addAttribute("wordChoices", currentQuestion.getChoices());
                    model.addAttribute("correctAnswer", currentQuestion.getAnswer());
                }

                // For qtype3 (reorder words) - add word lists
                if (actualLessonType == 3) {
                    model.addAttribute("wordsToOrder", currentQuestion.getWords());
                    model.addAttribute("correctOrder", currentQuestion.getCorrectOrder());
                }
                // For qtype4 (reorder chars) - add character lists
                if (actualLessonType == 4) {
                    model.addAttribute("charsToOrder", currentQuestion.getChars());
                    model.addAttribute("correctCharOrder", currentQuestion.getCharOrder());
                }
            }

            // Return appropriate template based on lesson type
            return "qtype" + actualLessonType;

        } catch (Exception e) {
            model.addAttribute("error", "Failed to load lesson: " + e.getMessage());
            return "error";
        }
    }

    // Lesson start page (q0.html equivalent)
    @GetMapping("/start/{topicId}/{lessonId}")
    public String startLesson(
            @PathVariable Integer topicId,
            @PathVariable Integer lessonId,
            Model model) {

        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserResponseDTO user = authService.getUserByUsername(username);
        try {
            LessonDTO lesson = lessonService.getLesson(topicId, lessonId);

            // Get lesson sentences to determine total questions count
            List<LessonSentence> lessonSentences = lessonSentenceRepository
                    .findByIdTopicIdAndIdLessonId(topicId, lessonId);

            model.addAttribute("lesson", lesson);
            model.addAttribute("user", user);
            model.addAttribute("topicId", topicId);
            model.addAttribute("lessonId", lessonId);
            model.addAttribute("lessonType", lesson.getLessonType().name());
            model.addAttribute("totalQuestions", lessonSentences.size()); // Pass total questions to template

            return "q0"; // lesson start template
        } catch (Exception e) {
            model.addAttribute("error", "Failed to load lesson: " + e.getMessage());
            return "error";
        }
    }

    // Helper class for template compatibility
    public static class WordChoice {
        private String word;

        public WordChoice(String word) {
            this.word = word;
        }

        public String getWord() {
            return word;
        }

        public void setWord(String word) {
            this.word = word;
        }
    }
}
