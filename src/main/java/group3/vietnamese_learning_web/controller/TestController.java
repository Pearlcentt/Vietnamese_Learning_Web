package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.QuestionDTO;
import group3.vietnamese_learning_web.dto.TestDTO;
import group3.vietnamese_learning_web.service.QuestionService;
import group3.vietnamese_learning_web.service.TestService;
import group3.vietnamese_learning_web.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;

@Controller
@RequestMapping("/tests")
@RequiredArgsConstructor
public class TestController {
    private final TestService testService;
    private final TopicService topicService;
    private final QuestionService questionService;

    @GetMapping
    public String listTests(Model model) {
        model.addAttribute("tests", testService.findAll());
        return "test/list";
    }

    @GetMapping("/{id}")
    public String detailTest(@PathVariable Long id, Model model) {
        model.addAttribute("test", testService.findById(id));
        return "test/detail";
    }

    @GetMapping("/create")
    public String createForm(Model model) {
        model.addAttribute("test", new TestDTO());
        model.addAttribute("topics", topicService.findAll());
        return "test/create";
    }

    @PostMapping
    public String createTest(@ModelAttribute TestDTO dto) {
        if (dto.getQuestions() == null) {
            dto.setQuestions(new HashSet<>());
        }
        testService.createTest(dto);
        return "redirect:/tests";
    }

    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        model.addAttribute("test", testService.findById(id));
        model.addAttribute("topics", topicService.findAll());
        return "test/edit";
    }

    @PostMapping("/update/{id}")
    public String updateTest(@PathVariable Long id, @ModelAttribute TestDTO dto) {
        testService.updateTest(id, dto);
        return "redirect:/tests";
    }

    @PostMapping("/delete/{id}")
    public String deleteTest(@PathVariable Long id) {
        testService.deleteTest(id);
        return "redirect:/tests";
    }
    
    @GetMapping("/{testId}/questions")
    public String listTestQuestions(@PathVariable Long testId, Model model) {
        model.addAttribute("test", testService.findById(testId));
        model.addAttribute("questions", questionService.findByTestId(testId));
        return "test/questions";
    }
    
    @GetMapping("/{testId}/questions/add")
    public String addQuestionForm(@PathVariable Long testId, Model model) {
        QuestionDTO questionDTO = new QuestionDTO();
        questionDTO.setTestId(testId);
        model.addAttribute("question", questionDTO);
        model.addAttribute("testId", testId);
        return "test/add-question";
    }
    
    @PostMapping("/{testId}/questions")
    public String addQuestion(@PathVariable Long testId, @ModelAttribute QuestionDTO dto) {
        dto.setTestId(testId);
        questionService.createQuestion(dto);
        return "redirect:/tests/" + testId + "/questions";
    }
    
    @GetMapping("/by-topic/{topicId}")
    public String getTestsByTopic(@PathVariable Long topicId, Model model) {
        model.addAttribute("tests", testService.findByTopicId(topicId));
        model.addAttribute("topic", topicService.findById(topicId));
        return "test/by-topic";
    }
}