package group3.vietnamese_learning_web.model;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "User")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "u_id")
    private Integer uId;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private LocalDate dob;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Gender gender; // enum Gender { Male, Female, Other }

    @Builder.Default
    @Column(name = "points", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer points = 0;

    // New avatar field - URL or path to avatar image @Builder.Default
    @Column(name = "avatar", length = 500)
    private String avatar = "/images/default_avatar.png";

    @Column(name = "date_created", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp dateCreated;
}