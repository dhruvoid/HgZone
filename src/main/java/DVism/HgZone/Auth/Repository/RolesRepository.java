package DVism.HgZone.Auth.Repository;

import DVism.HgZone.Auth.Entity.Roles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RolesRepository extends JpaRepository<Roles, UUID> {
    Roles findByName(String name);
}
