package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.BadgeDTO;
import group3.vietnamese_learning_web.exception.ResourceNotFoundException;
import group3.vietnamese_learning_web.model.Badge;
import group3.vietnamese_learning_web.repository.BadgeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BadgeService {
    private final BadgeRepository badgeRepository;

    public List<BadgeDTO> findAll() {
        return badgeRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public BadgeDTO findById(Long id) {
        Badge badge = badgeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Badge not found with id: " + id));
        return toDTO(badge);
    }

    public BadgeDTO findByName(String name) {
        Badge badge = badgeRepository.findByName(name);
        if (badge == null) {
            throw new ResourceNotFoundException("Badge not found with name: " + name);
        }
        return toDTO(badge);
    }

    @Transactional
    public BadgeDTO createBadge(BadgeDTO dto) {
        Badge badge = Badge.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .conditionType(dto.getConditionType())
                .conditionValue(dto.getConditionValue())
                .build();
        
        return toDTO(badgeRepository.save(badge));
    }

    @Transactional
    public BadgeDTO updateBadge(Long id, BadgeDTO dto) {
        Badge badge = badgeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Badge not found with id: " + id));
        
        badge.setName(dto.getName());
        badge.setDescription(dto.getDescription());
        badge.setImageUrl(dto.getImageUrl());
        badge.setConditionType(dto.getConditionType());
        badge.setConditionValue(dto.getConditionValue());
        
        return toDTO(badgeRepository.save(badge));
    }

    @Transactional
    public void deleteBadge(Long id) {
        if (!badgeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Badge not found with id: " + id);
        }
        badgeRepository.deleteById(id);
    }

    private BadgeDTO toDTO(Badge badge) {
        return BadgeDTO.builder()
                .id(badge.getId())
                .name(badge.getName())
                .description(badge.getDescription())
                .imageUrl(badge.getImageUrl())
                .conditionType(badge.getConditionType())
                .conditionValue(badge.getConditionValue())
                .build();
    }
}