package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.UserResponseDTO;
import group3.vietnamese_learning_web.model.User;
import group3.vietnamese_learning_web.repository.UserRepository;
import group3.vietnamese_learning_web.repository.ProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaderboardService {

    private final UserRepository userRepository;
    private final ProgressRepository progressRepository;
    private final AuthService authService;

    public List<UserResponseDTO> getTopUsers(int limit) {
        // Get users with their progress scores instead of points
        List<Object[]> userScores = progressRepository.sumScoresGroupByUserId();
        Map<Integer, Integer> userScoreMap = new HashMap<>();

        for (Object[] row : userScores) {
            Integer userId = (Integer) row[0];
            Integer totalScore = ((Number) row[1]).intValue();
            userScoreMap.put(userId, totalScore);
        }

        // Update user points in database to match calculated Progress scores
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            Integer progressScore = userScoreMap.getOrDefault(user.getUId(), 0);
            if (!progressScore.equals(user.getPoints())) {
                user.setPoints(progressScore);
                userRepository.save(user);
            }
        }

        // Get all users and sort by their progress scores
        return allUsers.stream()
                .sorted((u1, u2) -> {
                    Integer score1 = userScoreMap.getOrDefault(u1.getUId(), 0);
                    Integer score2 = userScoreMap.getOrDefault(u2.getUId(), 0);
                    return score2.compareTo(score1); // Descending order
                }).limit(limit)
                .map(user -> {
                    UserResponseDTO dto = authService.toResponseDTOWithoutStreak(user);
                    // Set the calculated progress score as points for display
                    dto.setPoints(userScoreMap.getOrDefault(user.getUId(), 0));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public void addPoints(User user, int points) {
        // This method is now deprecated as we calculate points from Progress table
        // Keep for backward compatibility but don't actually modify user points
        // Points are now calculated dynamically from Progress scores
        // Instead, trigger a sync of points from Progress table
        syncUserPointsFromProgress(user.getUId());
    }

    public void addPoints(Integer userId, int points) {
        // This method is now deprecated as we calculate points from Progress table
        // Keep for backward compatibility but don't actually modify user points
        // Points are now calculated dynamically from Progress scores
        // Instead, trigger a sync of points from Progress table
        syncUserPointsFromProgress(userId);
    }

    public int getUserProgressScore(Integer userId) {
        return progressRepository.sumScoresByUserId(userId);
    }

    /**
     * Synchronizes user's points field with their calculated Progress scores
     */
    public void syncUserPointsFromProgress(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            Integer progressScore = getUserProgressScore(userId);
            if (!progressScore.equals(user.getPoints())) {
                user.setPoints(progressScore);
                userRepository.save(user);
            }
        }
    }

    /**
     * Synchronizes all users' points fields with their calculated Progress scores
     */
    public void syncAllUserPointsFromProgress() {
        List<Object[]> userScores = progressRepository.sumScoresGroupByUserId();
        Map<Integer, Integer> userScoreMap = new HashMap<>();

        for (Object[] row : userScores) {
            Integer userId = (Integer) row[0];
            Integer totalScore = ((Number) row[1]).intValue();
            userScoreMap.put(userId, totalScore);
        }

        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            Integer progressScore = userScoreMap.getOrDefault(user.getUId(), 0);
            if (!progressScore.equals(user.getPoints())) {
                user.setPoints(progressScore);
                userRepository.save(user);
            }
        }
    }

    public int getUserRank(User user) {
        // Calculate ranks based on Progress scores instead of user points
        List<Object[]> userScores = progressRepository.sumScoresGroupByUserId();
        Map<Integer, Integer> userScoreMap = new HashMap<>();

        for (Object[] row : userScores) {
            Integer userId = (Integer) row[0];
            Integer totalScore = ((Number) row[1]).intValue();
            userScoreMap.put(userId, totalScore);
        }

        List<User> allUsers = userRepository.findAll();
        List<User> sortedUsers = allUsers.stream()
                .sorted((u1, u2) -> {
                    Integer score1 = userScoreMap.getOrDefault(u1.getUId(), 0);
                    Integer score2 = userScoreMap.getOrDefault(u2.getUId(), 0);
                    return score2.compareTo(score1); // Descending order
                })
                .collect(Collectors.toList());

        for (int i = 0; i < sortedUsers.size(); i++) {
            if (sortedUsers.get(i).getUId().equals(user.getUId())) {
                return i + 1; // Return 1-based rank
            }
        }
        return sortedUsers.size(); // If not found, return last position
    }
}
