package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.model.Badge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BadgeRepository extends JpaRepository<Badge, Long> {
    Badge findByName(String name);
}