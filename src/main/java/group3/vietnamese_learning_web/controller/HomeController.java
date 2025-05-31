package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.TopicProgressDTO;
import group3.vietnamese_learning_web.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class HomeController {
    private final TopicService topicService;

    // Show dashboard with user topic progress
    @GetMapping("/dashboard")
    public String dashboard(@RequestParam Integer uId, Model model) {
        List<TopicProgressDTO> topics = topicService.getTopicProgressByUser(uId);
        model.addAttribute("topics", topics);
        return "dashboard"; // Thymeleaf template for the dashboard
    }

    // Search topics (optional)
    @GetMapping("/topics/search")
    public String searchTopics(@RequestParam String keyword, Model model) {
        model.addAttribute("topics", topicService.searchTopics(keyword));
        return "topics";
    }

    // Topic detail page
    @GetMapping("/topics/{topicId}")
    public String topicDetail(@PathVariable Integer topicId, Model model) {
        model.addAttribute("topic", topicService.getTopic(topicId));
        return "topic-detail";
    }
}
