package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.ProgressDTO;
import group3.vietnamese_learning_web.model.Progress;
import group3.vietnamese_learning_web.model.ProgressId;
import group3.vietnamese_learning_web.model.ProgressStatus;
import group3.vietnamese_learning_web.repository.ProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {
    private final ProgressRepository progressRepository;

    public List<ProgressDTO> getProgressByUser(Integer uId) {
        return progressRepository.findByIdUId(uId)
                .stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProgressDTO> getProgressByUserAndTopic(Integer uId, Integer topicId) {
        return progressRepository.findByIdUIdAndIdTopicId(uId, topicId)
                .stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProgressDTO getProgress(Integer uId, Integer topicId, Integer lessonId) {
        return progressRepository.findByIdUIdAndIdTopicIdAndIdLessonId(uId, topicId, lessonId)
                .map(this::toDTO)
                .orElse(null);
    }

    public ProgressDTO updateProgress(Integer uId, Integer topicId, Integer lessonId, Integer score, ProgressStatus status) {
        ProgressId id = new ProgressId(uId, topicId, lessonId);
        Progress progress = progressRepository.findById(id).orElse(
                Progress.builder().id(id).build()
        );
        progress.setScore(score);
        progress.setStatus(status);
        Progress saved = progressRepository.save(progress);
        return toDTO(saved);
    }

    private ProgressDTO toDTO(Progress progress) {
        return ProgressDTO.builder()
                .uId(progress.getId().getUId())
                .topicId(progress.getId().getTopicId())
                .lessonId(progress.getId().getLessonId())
                .score(progress.getScore())
                .status(progress.getStatus())
                .build();
    }
}
