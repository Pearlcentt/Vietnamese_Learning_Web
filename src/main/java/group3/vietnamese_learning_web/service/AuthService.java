package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.model.User;
import group3.vietnamese_learning_web.repository.ProgressRepository;
import group3.vietnamese_learning_web.repository.UserRepository;
import group3.vietnamese_learning_web.dto.UserRegistrationDTO;
import group3.vietnamese_learning_web.dto.UserLoginDTO;
import group3.vietnamese_learning_web.dto.UserResponseDTO;
import group3.vietnamese_learning_web.dto.UserEditForm;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.ArrayList;
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
                .password(user.getPassword()) // must be encoded
                .roles("USER") // or user.getRole() if present
                .build();
    }    public UserResponseDTO getUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }
        User user = userOpt.get();
        return UserResponseDTO.builder()
                .uId(user.getUId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .dob(user.getDob())
                .gender(user.getGender())
                .gems(306)
                .points(user.getPoints() != null ? user.getPoints() : 0)
                .avatar(user.getAvatar() != null ? user.getAvatar() : "/images/default_avatar.png")
                .friendIds(user.getFriendIds() != null ? user.getFriendIds() : new ArrayList<>())
                .build();
    }

    public UserResponseDTO getUserByUid(Integer uid) {
        Optional<User> userOpt = userRepository.findById(uid);
        if (!userOpt.isPresent()) {
            return null;
        }
        return toResponseDTO(userOpt.get());
    }

    /**
     * Optimized version of getUserByUid that doesn't calculate streak
     * Use this for friend lists to avoid N+1 queries
     */
    public UserResponseDTO getUserByUidWithoutStreak(Integer uid) {
        Optional<User> userOpt = userRepository.findById(uid);
        if (!userOpt.isPresent()) {
            return null;
        }
        return toResponseDTOWithoutStreak(userOpt.get());
    }

    public List<UserResponseDTO> searchUsersByName(String query) {
        // Search by username only (case-insensitive)
        System.out.println("DEBUG: AuthService.searchUsersByName called with query: '" + query + "'");

        List<User> users = userRepository.findByUsernameContainingIgnoreCase(query);
        System.out.println("DEBUG: Database returned " + users.size() + " users");

        for (User user : users) {
            System.out.println("DEBUG: User from DB - ID: " + user.getUId() + ", Username: " + user.getUsername()
                    + ", Name: " + user.getName());
        }        List<UserResponseDTO> result = users.stream()
                .map(this::toResponseDTOWithoutStreak) // Use optimized version without streak calculation
                .collect(Collectors.toList());

        System.out.println("DEBUG: Converted to " + result.size() + " DTOs");
        // Debug: Print the actual DTO content
        for (UserResponseDTO dto : result) {
            System.out.println("DEBUG: DTO - ID: " + dto.getUId() + ", Username: " + dto.getUsername() + ", Name: " + dto.getName());
        }
        return result;
    }

    public int calculateStreak(Integer uid) {
        try {
            List<Date> progressDates = progressRepository.findDistinctProgressDatesByUid(uid);
            Set<LocalDate> daysWithProgress = progressDates.stream()
                    .map(sqlDate -> sqlDate.toLocalDate())
                    .collect(Collectors.toSet());

            LocalDate today = LocalDate.now();
            int streak = 0;

            // Count backward from today until you find a day with no progress
            while (daysWithProgress.contains(today.minusDays(streak))) {
                streak++;
            }
            return streak;
        } catch (Exception e) {
            // If there's any issue with streak calculation, return 0
            return 0;
        }
    }    public UserResponseDTO toResponseDTO(User user) {
        UserResponseDTO dto = UserResponseDTO.builder()
                .uId(user.getUId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .dob(user.getDob())
                .gender(user.getGender())
                .gems(306)
                .points(user.getPoints() != null ? user.getPoints() : 0)
                .avatar(user.getAvatar() != null ? user.getAvatar() : "/images/default_avatar.png")
                .friendIds(user.getFriendIds() != null ? user.getFriendIds() : new ArrayList<>())
                .build();

        // Set streak
        int streak = calculateStreak(user.getUId());
        dto.setStreak(streak);
        return dto;
    }    /**
     * Optimized version of toResponseDTO that doesn't calculate streak
     * Use this for search results and friend lists to avoid N+1 queries
     */
    public UserResponseDTO toResponseDTOWithoutStreak(User user) {
        return UserResponseDTO.builder()
                .uId(user.getUId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .dob(user.getDob())
                .gender(user.getGender())
                .gems(306)
                .points(user.getPoints() != null ? user.getPoints() : 0)
                .avatar(user.getAvatar() != null ? user.getAvatar() : "/images/default_avatar.png")
                .friendIds(user.getFriendIds() != null ? user.getFriendIds() : new ArrayList<>())
                .streak(0) // Default streak to avoid database query
                .build();
    }

    public UserResponseDTO updateProfile(String username, UserEditForm editForm) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Verify current password if provided
        if (editForm.getCurrentPassword() != null && !editForm.getCurrentPassword().isEmpty()) {
            if (!passwordEncoder.matches(editForm.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Current password is incorrect");
            }
        }

        // Update fields if provided
        boolean updated = false;

        if (editForm.getDisplayName() != null && !editForm.getDisplayName().trim().isEmpty()) {
            user.setName(editForm.getDisplayName().trim());
            updated = true;
        }

        if (editForm.getEmail() != null && !editForm.getEmail().trim().isEmpty()) {
            // Check if email is already taken by another user
            Optional<User> existingUser = userRepository.findByEmail(editForm.getEmail().trim());
            if (existingUser.isPresent() && !existingUser.get().getUId().equals(user.getUId())) {
                throw new RuntimeException("Email is already taken by another user");
            }
            user.setEmail(editForm.getEmail().trim());
            updated = true;
        }        // Update password if new password is provided and current password was verified
        if (editForm.getNewPassword() != null && !editForm.getNewPassword().isEmpty() &&
                editForm.getCurrentPassword() != null && !editForm.getCurrentPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(editForm.getNewPassword()));
            updated = true;
        }

        // Update avatar if provided
        if (editForm.getAvatar() != null && !editForm.getAvatar().trim().isEmpty()) {
            user.setAvatar(editForm.getAvatar().trim());
            updated = true;
        }

        // Update avatar if provided
        if (editForm.getAvatar() != null && !editForm.getAvatar().trim().isEmpty()) {
            user.setAvatar(editForm.getAvatar().trim());
            updated = true;
        }

        if (updated) {
            user = userRepository.save(user);
        }

        return toResponseDTO(user);
    }
}
