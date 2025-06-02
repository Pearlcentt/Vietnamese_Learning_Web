package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmailOrUsername(String email, String username);

    // Points-based leaderboard queries
    List<User> findTop10ByOrderByPointsDesc();

    List<User> findAllByOrderByPointsDesc();

    @Query("SELECT u FROM User u WHERE u.points > 0 ORDER BY u.points DESC")
    List<User> findUsersWithPointsOrderByPointsDesc(); // Search users by name or username (case-insensitive)

    List<User> findByNameContainingIgnoreCaseOrUsernameContainingIgnoreCase(String name, String username);

    // Search users by username only (case-insensitive)
    List<User> findByUsernameContainingIgnoreCase(String username);
}
