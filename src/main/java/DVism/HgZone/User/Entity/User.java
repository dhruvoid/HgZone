package DVism.HgZone.User.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import DVism.HgZone.Auth.Entity.Roles;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255, name = "password_hash")
    private String password;

    @Column(length = 100, name = "display_name")
    private String firstName;

    @Column(nullable = false, name = "enabled")
    private Boolean isActive = true;

    @Column(nullable = false, updatable = false, name = "created_at")
    private LocalDateTime createdDate = LocalDateTime.now();

    @Column(nullable = false, name = "updated_at")
    private LocalDateTime updatedDate = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false, foreignKey = @ForeignKey(name = "fk_user_role"))
    private Roles role;
}
