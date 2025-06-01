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

    @GetMapping("/lesson")
    public List<QuestionDTO> getQuestionsForLesson(
            @RequestParam List<Integer> sentenceIds,
            @RequestParam int lessonType
    ) {
        return questionService.getQuestionsForLesson(sentenceIds, lessonType);
    }
}
