package group3.vietnamese_learning_web.controller;

import group3.vietnamese_learning_web.dto.BadgeDTO;
import group3.vietnamese_learning_web.service.BadgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Controller
@RequestMapping("/badges")
@RequiredArgsConstructor
public class BadgeController {
    private final BadgeService badgeService;

    @GetMapping
    public String listBadges(Model model) {
        model.addAttribute("badges", badgeService.findAll());
        return "badge/list";
    }

    @GetMapping("/{id}")
    public String detailBadge(@PathVariable Long id, Model model) {
        model.addAttribute("badge", badgeService.findById(id));
        return "badge/detail";
    }

    @GetMapping("/create")
    public String createForm(Model model) {
        model.addAttribute("badge", new BadgeDTO());
        return "badge/create";
    }

    @PostMapping
    public String createBadge(@ModelAttribute BadgeDTO dto, @RequestParam(required = false) MultipartFile badgeImage) {
        if (badgeImage != null && !badgeImage.isEmpty()) {
            String imageUrl = saveImage(badgeImage);
            dto.setImageUrl(imageUrl);
        }
        
        badgeService.createBadge(dto);
        return "redirect:/badges";
    }

    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        model.addAttribute("badge", badgeService.findById(id));
        return "badge/edit";
    }

    @PostMapping("/update/{id}")
    public String updateBadge(@PathVariable Long id, @ModelAttribute BadgeDTO dto, 
                              @RequestParam(required = false) MultipartFile badgeImage) {
        if (badgeImage != null && !badgeImage.isEmpty()) {
            String imageUrl = saveImage(badgeImage);
            dto.setImageUrl(imageUrl);
        }
        
        badgeService.updateBadge(id, dto);
        return "redirect:/badges";
    }

    @PostMapping("/delete/{id}")
    public String deleteBadge(@PathVariable Long id) {
        badgeService.deleteBadge(id);
        return "redirect:/badges";
    }
    
    private String saveImage(MultipartFile image) {
        try {
            // Create directory if it doesn't exist
            Path uploadDir = Paths.get("src/main/resources/static/uploads/badges");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            
            // Generate unique filename
            String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path filePath = uploadDir.resolve(filename);
            
            // Save file
            Files.copy(image.getInputStream(), filePath);
            
            // Return relative path for storage in DB
            return "/uploads/badges/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save badge image", e);
        }
    }
}