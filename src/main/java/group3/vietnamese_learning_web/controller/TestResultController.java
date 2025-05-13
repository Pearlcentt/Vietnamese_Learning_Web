package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.TestResultDTO;
import group3.vietnamese_learning_web.service.StudentService;
import group3.vietnamese_learning_web.service.TestResultService;
import group3.vietnamese_learning_web.service.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/test-results")
@RequiredArgsConstructor
public class TestResultController {
    private final TestResultService testResultService;
    private final StudentService studentService;
    private final TestService testService;

    @GetMapping
    public String listTestResults(Model model) {
        model.addAttribute("testResults", testResultService.findAll());
        return "test-result/list";
    }

    @GetMapping("/{id}")
    public String detailTestResult(@PathVariable Long id, Model model) {
        model.addAttribute("testResult", testResultService.findById(id));
        return "test-result/detail";
    }
    
    @GetMapping("/student/{studentId}")
    public String getTestResultsByStudent(@PathVariable Long studentId, Model model) {
        model.addAttribute("testResults", testResultService.findByStudentId(studentId));
        model.addAttribute("student", studentService.findById(studentId));
        return "test-result/by-student";
    }
    
    @GetMapping("/submit/{testId}")
    public String submitTestForm(@PathVariable Long testId, @RequestParam Long studentId, Model model) {
        model.addAttribute("test", testService.findById(testId));
        model.addAttribute("student", studentService.findById(studentId));
        model.addAttribute("testResult", new TestResultDTO());
        return "test-result/submit";
    }
    
    @PostMapping("/submit")
    public String submitTestResult(@ModelAttribute TestResultDTO dto) {
        TestResultDTO savedResult = testResultService.saveTestResult(dto);
        return "redirect:/test-results/" + savedResult.getId();
    }
    
    @GetMapping("/certificate/{id}")
    public String viewCertificate(@PathVariable Long id, Model model) {
        TestResultDTO result = testResultService.findById(id);
        if (!result.getPassed()) {
            return "redirect:/test-results/" + id + "?error=not-passed";
        }
        
        model.addAttribute("testResult", result);
        model.addAttribute("student", studentService.findById(result.getStudentId()));
        model.addAttribute("test", testService.findById(result.getTestId()));
        
        return "test-result/certificate";
    }
    
    @PostMapping("/delete/{id}")
    public String deleteTestResult(@PathVariable Long id, @RequestParam Long studentId) {
        testResultService.deleteTestResult(id);
        return "redirect:/test-results/student/" + studentId;
    }
}