package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.TopicProgressDTO;
import group3.vietnamese_learning_web.model.User;
import group3.vietnamese_learning_web.service.TopicService;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class HomeController {

    @Autowired
    private TopicService topicService;

    @GetMapping("/home")
    public String showDashboard(HttpSession session, Model model) {
        User user = (User) session.getAttribute("currentUser");
        if (user == null) return "redirect:/login";

        List<TopicProgressDTO> topics = topicService.getTopicsWithProgress(user.getUId());
        model.addAttribute("user", user);
        model.addAttribute("topics", topics);

        return "start-copy";
    }
}
