package group3.vietnamese_learning_web.controller;
import group3.vietnamese_learning_web.dto.LessonDTO;
import group3.vietnamese_learning_web.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/lessons")
@RequiredArgsConstructor
public class LessonController {
    private final LessonService lessonService;

    @GetMapping
    public String listLessons(Model model) {
        model.addAttribute("lessons", lessonService.findAll());
        return "lesson/list";
    }

    @GetMapping("/{id}")
    public String detailLesson(@PathVariable Long id, Model model) {
        model.addAttribute("lesson", lessonService.findById(id));
        return "lesson/detail";
    }

    @GetMapping("/create")
    public String createForm(Model model) {
        model.addAttribute("lesson", new LessonDTO());
        return "lesson/create";
    }

    @PostMapping
    public String createLesson(@ModelAttribute LessonDTO dto) {
        lessonService.createLesson(dto);
        return "redirect:/lessons";
    }

    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        model.addAttribute("lesson", lessonService.findById(id));
        return "lesson/edit";
    }

    @PostMapping("/update/{id}")
    public String updateLesson(@PathVariable Long id, @ModelAttribute LessonDTO dto) {
        lessonService.updateLesson(id, dto);
        return "redirect:/lessons";
    }

    @PostMapping("/delete/{id}")
    public String deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return "redirect:/lessons";
    }
}
