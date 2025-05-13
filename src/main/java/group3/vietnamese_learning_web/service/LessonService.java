package group3.vietnamese_learning_web.service;
import group3.vietnamese_learning_web.dto.LessonDTO;
import group3.vietnamese_learning_web.exception.ResourceNotFoundException;
import group3.vietnamese_learning_web.model.Lesson;
import group3.vietnamese_learning_web.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonService {
    private final LessonRepository lessonRepository;

    public List<LessonDTO> findAll() {
        return lessonRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public LessonDTO findById(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + id));
        return toDTO(lesson);
    }

    public LessonDTO createLesson(LessonDTO dto) {
        Lesson lesson = Lesson.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return toDTO(lessonRepository.save(lesson));
    }

    public LessonDTO updateLesson(Long id, LessonDTO dto) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + id));
        lesson.setTitle(dto.getTitle());
        lesson.setContent(dto.getContent());
        lesson.setUpdatedAt(LocalDateTime.now());
        return toDTO(lessonRepository.save(lesson));
    }

    public void deleteLesson(Long id) {
        if (!lessonRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lesson not found with id: " + id);
        }
        lessonRepository.deleteById(id);
    }

    private LessonDTO toDTO(Lesson lesson) {
        return LessonDTO.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .content(lesson.getContent())
                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt())
                .build();
    }
}

