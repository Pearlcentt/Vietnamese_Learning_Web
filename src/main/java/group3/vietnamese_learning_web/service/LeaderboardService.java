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

        // Get all users and sort by their progress scores
        List<User> allUsers = userRepository.findAll();
        return allUsers.stream()
                .sorted((u1, u2) -> {
                    Integer score1 = userScoreMap.getOrDefault(u1.getUId(), 0);
                    Integer score2 = userScoreMap.getOrDefault(u2.getUId(), 0);
                    return score2.compareTo(score1); // Descending order
                })
                .limit(limit)
                .map(user -> {
                    UserResponseDTO dto = authService.toResponseDTO(user);
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
    }

    public void addPoints(Integer userId, int points) {
        // This method is now deprecated as we calculate points from Progress table
        // Keep for backward compatibility but don't actually modify user points
        // Points are now calculated dynamically from Progress scores
    }

    public int getUserProgressScore(Integer userId) {
        return progressRepository.sumScoresByUserId(userId);
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
