package DVism.HgZone.Auth.Repository;

import DVism.HgZone.Auth.Entity.RefreshTokens;
import DVism.HgZone.User.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokensRepository extends JpaRepository<RefreshTokens, UUID> {
    Optional<RefreshTokens> findByToken(String token);
    void deleteByUser(User user);
}