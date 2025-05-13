package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    
    @Query("SELECT s FROM Student s ORDER BY s.totalPoints DESC")
    List<Student> findAllByOrderByTotalPointsDesc();
    
    @Query("SELECT s FROM Student s WHERE s.id IN " +
            "(SELECT f.id FROM Student st JOIN st.friends f WHERE st.id = :studentId) " +
            "ORDER BY s.totalPoints DESC")
    List<Student> findFriendsLeaderboard(@Param("studentId") Long studentId);
}