package DVism.HgZone.User.Repository;

import DVism.HgZone.User.Entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    User findByUsername(String username);

    User findByEmail(@NotBlank(message = "Email cannot be blank") @Email(message = "Email must be valid") String email);
}
