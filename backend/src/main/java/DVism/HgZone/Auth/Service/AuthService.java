package DVism.HgZone.Auth.Service;

import DVism.HgZone.Auth.DTO.Request.RegisterRequest;
import DVism.HgZone.Auth.DTO.Response.RegisterResponse;
import DVism.HgZone.Auth.Entity.Roles;
import DVism.HgZone.Auth.Mapper.UserMapper;
import DVism.HgZone.Auth.Repository.RolesRepository;
import DVism.HgZone.User.Entity.User;
import DVism.HgZone.User.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import DVism.HgZone.Auth.Entity.RefreshTokens;
import DVism.HgZone.Auth.Repository.RefreshTokensRepository;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RolesRepository rolesRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    UserMapper userMapper;

    @Autowired
    JwtService jwtService;

    @Autowired
    DVism.HgZone.Auth.Repository.RefreshTokensRepository refreshTokensRepository;

    public RegisterResponse registerUser(RegisterRequest registerRequest) {
        checkUniqueUsernameandEmail(registerRequest);

        Roles role = rolesRepository.findByName("USER");
        User newUser = userMapper.toUser(registerRequest,role);
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        User savedUser = userRepository.save(newUser);

        RegisterResponse response = userMapper.toRegisterResponse(savedUser, "User registered successfully");
        return response;
    }

    private void checkUniqueUsernameandEmail(RegisterRequest registerRequest){
        if (userRepository.findByUsername(registerRequest.getUsername()) != null) {
            throw new IllegalArgumentException("Username already exists");
        }
        if(userRepository.findByEmail(registerRequest.getEmail()) != null) {
            throw new IllegalArgumentException("Email already exists");
        }
    }

    public DVism.HgZone.Auth.DTO.Response.LoginResponse loginUser(DVism.HgZone.Auth.DTO.Request.LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());
        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshTokenValue = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(30);
        RefreshTokens refreshTokens = new RefreshTokens(null, refreshTokenValue, expiresAt, false, LocalDateTime.now(), user);
        refreshTokensRepository.save(refreshTokens);

        DVism.HgZone.Auth.DTO.Response.LoginResponse response = new DVism.HgZone.Auth.DTO.Response.LoginResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshTokenValue);
        response.setTokenType("Bearer");
        response.setExpiresIn(jwtService.getAccessTokenExpiration());

        return response;
    }
}
