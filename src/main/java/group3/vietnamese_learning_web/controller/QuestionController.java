package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.QuestionDTO;
import group3.vietnamese_learning_web.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    // Example: Get questions for a lesson (provide sentence IDs as a param or from your lesson logic)
    @GetMapping("/lesson")
    public List<QuestionDTO> getQuestionsForLesson(@RequestParam List<Integer> sentenceIds) {
        return questionService.getQuestionsForLesson(sentenceIds);
    }
}
