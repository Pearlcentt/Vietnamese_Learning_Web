package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.QuestionDTO;
import group3.vietnamese_learning_web.model.Question.QuestionType;
import group3.vietnamese_learning_web.service.LessonService;
import group3.vietnamese_learning_web.service.QuestionService;
import group3.vietnamese_learning_web.service.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;
    private final LessonService lessonService;
    private final TestService testService;

    @GetMapping
    public String listQuestions(Model model) {
        model.addAttribute("questions", questionService.findAll());
        return "question/list";
    }

    @GetMapping("/{id}")
    public String detailQuestion(@PathVariable Long id, Model model) {
        model.addAttribute("question", questionService.findById(id));
        return "question/detail";
    }

    @GetMapping("/create")
    public String createForm(Model model) {
        model.addAttribute("question", new QuestionDTO());
        model.addAttribute("lessons", lessonService.findAll());
        model.addAttribute("tests", testService.findAll());
        model.addAttribute("questionTypes", QuestionType.values());
        return "question/create";
    }

    @PostMapping
    public String createQuestion(@ModelAttribute QuestionDTO dto) {
        questionService.createQuestion(dto);
        return "redirect:/questions";
    }

    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        model.addAttribute("question", questionService.findById(id));
        model.addAttribute("lessons", lessonService.findAll());
        model.addAttribute("tests", testService.findAll());
        model.addAttribute("questionTypes", QuestionType.values());
        return "question/edit";
    }

    @PostMapping("/update/{id}")
    public String updateQuestion(@PathVariable Long id, @ModelAttribute QuestionDTO dto) {
        questionService.updateQuestion(id, dto);
        return "redirect:/questions";
    }

    @PostMapping("/delete/{id}")
    public String deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return "redirect:/questions";
    }
    
    @GetMapping("/by-lesson/{lessonId}")
    public String getQuestionsByLesson(@PathVariable Long lessonId, Model model) {
        model.addAttribute("questions", questionService.findByLessonId(lessonId));
        model.addAttribute("lesson", lessonService.findById(lessonId));
        return "question/by-lesson";
    }
    
    @GetMapping("/by-test/{testId}")
    public String getQuestionsByTest(@PathVariable Long testId, Model model) {
        model.addAttribute("questions", questionService.findByTestId(testId));
        model.addAttribute("test", testService.findById(testId));
        return "question/by-test";
    }
}