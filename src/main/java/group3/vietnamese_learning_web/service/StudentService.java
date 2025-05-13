package group3.vietnamese_learning_web.service;

import group3.vietnamese_learning_web.dto.StudentDTO;
import group3.vietnamese_learning_web.exception.ResourceNotFoundException;
import group3.vietnamese_learning_web.model.Badge;
import group3.vietnamese_learning_web.model.Student;
import group3.vietnamese_learning_web.repository.BadgeRepository;
import group3.vietnamese_learning_web.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;
    private final BadgeRepository badgeRepository;
    private final PasswordEncoder passwordEncoder;

    public List<StudentDTO> findAll() {
        return studentRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public StudentDTO findById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return toDTO(student);
    }

    public StudentDTO findByEmail(String email) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + email));
        return toDTO(student);
    }

    @Transactional
    public StudentDTO createStudent(StudentDTO dto, String password) {
        Student student = Student.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(password))
                .bio(dto.getBio())
                .dateOfBirth(dto.getDateOfBirth())
                .avatarUrl(dto.getAvatarUrl())
                .totalPoints(0)
                .level(1)
                .badges(new HashSet<>())
                .friends(new HashSet<>())
                .build();
        
        return toDTO(studentRepository.save(student));
    }

    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setBio(dto.getBio());
        student.setDateOfBirth(dto.getDateOfBirth());
        
        return toDTO(studentRepository.save(student));
    }

    @Transactional
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    @Transactional
    public void updateAvatar(Long id, String avatarUrl) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        student.setAvatarUrl(avatarUrl);
        studentRepository.save(student);
    }

    @Transactional
    public void updatePassword(Long id, String currentPassword, String newPassword) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        
        if (!passwordEncoder.matches(currentPassword, student.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        student.setPassword(passwordEncoder.encode(newPassword));
        studentRepository.save(student);
    }

    @Transactional
    public void addPoints(Long id, Integer points) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        
        if (student.getTotalPoints() == null) {
            student.setTotalPoints(0);
        }
        
        student.setTotalPoints(student.getTotalPoints() + points);
        
        // Update level based on points
        int newLevel = (student.getTotalPoints() / 100) + 1;
        if (newLevel > student.getLevel()) {
            student.setLevel(newLevel);
        }
        
        studentRepository.save(student);
    }

    @Transactional
    public void addBadge(Long studentId, Long badgeId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        Badge badge = badgeRepository.findById(badgeId)
                .orElseThrow(() -> new ResourceNotFoundException("Badge not found with id: " + badgeId));
        
        student.getBadges().add(badge);
        studentRepository.save(student);
    }

    @Transactional
    public void addFriend(Long studentId, Long friendId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        Student friend = studentRepository.findById(friendId)
                .orElseThrow(() -> new ResourceNotFoundException("Friend not found with id: " + friendId));
        
        student.getFriends().add(friend);
        studentRepository.save(student);
    }

    public List<StudentDTO> getGlobalLeaderboard() {
        return studentRepository.findAllByOrderByTotalPointsDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<StudentDTO> getFriendsLeaderboard(Long studentId) {
        return studentRepository.findFriendsLeaderboard(studentId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private StudentDTO toDTO(Student student) {
        Set<Long> badgeIds = student.getBadges() != null ? 
                student.getBadges().stream().map(Badge::getId).collect(Collectors.toSet()) : 
                new HashSet<>();
                
        Set<Long> friendIds = student.getFriends() != null ? 
                student.getFriends().stream().map(Student::getId).collect(Collectors.toSet()) : 
                new HashSet<>();
                
        return StudentDTO.builder()
                .id(student.getId())
                .name(student.getName())
                .email(student.getEmail())
                .bio(student.getBio())
                .dateOfBirth(student.getDateOfBirth())
                .avatarUrl(student.getAvatarUrl())
                .totalPoints(student.getTotalPoints())
                .level(student.getLevel())
                .badgeIds(badgeIds)
                .friendIds(friendIds)
                .build();
    }
}