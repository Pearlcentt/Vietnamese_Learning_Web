package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.service.QuestionService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
public class QuestionController {

    @Autowired private QuestionService questionService;

    @GetMapping("/q0")
    public String routeToQ0(@RequestParam("topicId") int topicId,
                            @RequestParam("lessonId") int lessonId,
                            HttpSession session,
                            Model model) {

        Map<String, Object> data = questionService.loadQuestionData(topicId, lessonId);
        if (data.isEmpty()) return "redirect:/lessons?topicId=" + topicId;

        session.setAttribute("quizData", data);
        model.addAttribute("lessonType", data.get("lessonType")); // Optional: display on q0.html
        return "q0"; // Thymeleaf view: templates/q0.html
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/quiz-start")
    public String resolveQuizType(HttpSession session) {
        Map<String, Object> data = (Map<String, Object>) session.getAttribute("quizData");
        if (data == null) return "redirect:/home";

        String type = (String) data.get("lessonType");

        return switch (type) {
            case "Vocab" -> "redirect:/qtype1";
            case "Fill_in_the_blank" -> "redirect:/qtype2";
            case "Re_order_chars" -> "redirect:/qtype3";
            case "Re_order_words" -> "redirect:/qtype4";
            case "Listen_and_fill" -> "redirect:/qtype5";
            default -> "redirect:/home";
        };
    }

}
