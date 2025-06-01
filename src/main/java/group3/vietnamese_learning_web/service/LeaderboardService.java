package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.UserResponseDTO;
import group3.vietnamese_learning_web.model.User;
import group3.vietnamese_learning_web.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaderboardService {
    
    private final UserRepository userRepository;
    private final AuthService authService;
    
    public List<UserResponseDTO> getTopUsers(int limit) {
        List<User> topUsers = userRepository.findTop10ByOrderByPointsDesc();
        return topUsers.stream()
                .limit(limit)
                .map(authService::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    public void addPoints(User user, int points) {
        if (user.getPoints() == null) {
            user.setPoints(0);
        }
        user.setPoints(user.getPoints() + points);
        userRepository.save(user);
    }
    
    public void addPoints(Integer userId, int points) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        addPoints(user, points);
    }
    
    public int getUserRank(User user) {
        List<User> allUsers = userRepository.findAllByOrderByPointsDesc();
        for (int i = 0; i < allUsers.size(); i++) {
            if (allUsers.get(i).getUId().equals(user.getUId())) {
                return i + 1; // Return 1-based rank
            }
        }
        return allUsers.size(); // If not found, return last position
    }
}
