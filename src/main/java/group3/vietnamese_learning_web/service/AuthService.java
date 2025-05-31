package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.model.User;
import group3.vietnamese_learning_web.repository.UserRepository;
import group3.vietnamese_learning_web.dto.UserRegistrationDTO;
import group3.vietnamese_learning_web.dto.UserLoginDTO;
import group3.vietnamese_learning_web.dto.UserResponseDTO;
import group3.vietnamese_learning_web.model.Gender;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDTO register(UserRegistrationDTO dto) {
        // Check email/username existence, validate inputs, etc.
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

    private UserResponseDTO toResponseDTO(User user) {
        return UserResponseDTO.builder()
                .uId(user.getUId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .dob(user.getDob())
                .gender(user.getGender())
                .build();
    }
}
