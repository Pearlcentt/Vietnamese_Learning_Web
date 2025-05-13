package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.TopicDTO;
import group3.vietnamese_learning_web.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/topics")
@RequiredArgsConstructor
public class TopicController {
    private final TopicService topicService;

    @GetMapping
    public String listTopics(Model model) {
        model.addAttribute("topics", topicService.findAll());
        return "topic/list";
    }

    @GetMapping("/{id}")
    public String detailTopic(@PathVariable Long id, Model model) {
        model.addAttribute("topic", topicService.findById(id));
        return "topic/detail";
    }

    @GetMapping("/create")
    public String createForm(Model model) {
        model.addAttribute("topic", new TopicDTO());
        return "topic/create";
    }

    @PostMapping
    public String createTopic(@ModelAttribute TopicDTO dto) {
        topicService.createTopic(dto);
        return "redirect:/topics";
    }

    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        model.addAttribute("topic", topicService.findById(id));
        return "topic/edit";
    }

    @PostMapping("/update/{id}")
    public String updateTopic(@PathVariable Long id, @ModelAttribute TopicDTO dto) {
        topicService.updateTopic(id, dto);
        return "redirect:/topics";
    }

    @PostMapping("/delete/{id}")
    public String deleteTopic(@PathVariable Long id) {
        topicService.deleteTopic(id);
        return "redirect:/topics";
    }
}