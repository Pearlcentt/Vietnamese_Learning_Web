package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.model.User;
import group3.vietnamese_learning_web.repository.ProgressRepository;
import group3.vietnamese_learning_web.repository.UserRepository;
import group3.vietnamese_learning_web.dto.UserRegistrationDTO;
import group3.vietnamese_learning_web.dto.UserLoginDTO;
import group3.vietnamese_learning_web.dto.UserResponseDTO;
import group3.vietnamese_learning_web.model.Gender;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProgressRepository progressRepository;

    public UserResponseDTO register(UserRegistrationDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent() ||
                userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Email or Username already exists");
        }
        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .name(dto.getName())
                .dob(dto.getDob())
                .gender(dto.getGender())
                .build();
        User saved = userRepository.save(user);
        return toResponseDTO(saved);
    }

    /*** Not used by Spring Security ***/
    public UserResponseDTO authenticate(UserLoginDTO dto) {
        Optional<User> userOpt = userRepository.findByEmail(dto.getEmailOrUsername());
        if (!userOpt.isPresent())
            userOpt = userRepository.findByUsername(dto.getEmailOrUsername());
        if (userOpt.isPresent() && passwordEncoder.matches(dto.getPassword(), userOpt.get().getPassword())) {
            return toResponseDTO(userOpt.get());
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    /*** Used by Spring Security for form login ***/
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(usernameOrEmail)
                .orElseGet(() -> userRepository.findByEmail(usernameOrEmail)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found")));
        // If you use roles/authorities, add here!
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername()) // username used for session
                .password(user.getPassword())     // must be encoded
                .roles("USER")                    // or user.getRole() if present
                .build();
    }

    public UserResponseDTO getUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return UserResponseDTO.builder()
                .uId(user.get().getUId())
                .username(user.get().getUsername())
                .email(user.get().getEmail())
                .name(user.get().getName())
                .dob(user.get().getDob())
                .gender(user.get().getGender())
                .gems(306)
                .build();
    }

    public int calculateStreak(Integer uid) {
        List<Timestamp> progressDates = progressRepository.findDistinctProgressDatesByUid(uid);
        Set<LocalDate> daysWithProgress = progressDates.stream()
                .map(ts -> ts.toLocalDateTime().toLocalDate())
                .collect(Collectors.toSet());

        LocalDate today = LocalDate.now();
        int streak = 0;

        // Count backward from today until you find a day with no progress
        while (daysWithProgress.contains(today.minusDays(streak))) {
            streak++;
        }
        return streak;
    }

    public UserResponseDTO toResponseDTO(User user) {
        UserResponseDTO dto = UserResponseDTO.builder()
                .uId(user.getUId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .dob(user.getDob())
                .gender(user.getGender())
                .gems(306)
                .build();

        // Set streak
        int streak = calculateStreak(user.getUId());
        dto.setStreak(streak);
        return dto;
    }
}
