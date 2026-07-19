package DVism.HgZone.Auth.Mapper;

import DVism.HgZone.Auth.DTO.Request.RegisterRequest;
import DVism.HgZone.Auth.DTO.Response.RegisterResponse;
import DVism.HgZone.Auth.Entity.Roles;
import DVism.HgZone.User.Entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public User toUser(RegisterRequest request, Roles role) {
        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(role);

        // Don't encode the password here.
        // The AuthenticationService should do that.
        user.setPassword(request.getPassword());

        return user;
    }

    public RegisterResponse toRegisterResponse(User user, String message) {
        RegisterResponse response = new RegisterResponse();

        response.setMessage(message);
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());

        return response;
    }
}
