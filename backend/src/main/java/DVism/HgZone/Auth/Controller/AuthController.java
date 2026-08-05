package DVism.HgZone.Auth.Controller;

import DVism.HgZone.Auth.DTO.Request.RegisterRequest;
import DVism.HgZone.Auth.DTO.Response.RegisterResponse;
import DVism.HgZone.Auth.Service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class AuthController {

    @Autowired
    AuthService authService;

    /**
     * Register endpoint contract:
     * POST /auth/register
     * Input: RegisterRequest object (username, password, email, firstName, lastName) in request body
     * Processing: Validates and registers the user via AuthenticationService
     * Output: ResponseEntity with registered User object and HTTP 200 OK
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        RegisterResponse response = authService.registerUser(registerRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<DVism.HgZone.Auth.DTO.Response.LoginResponse> login(
            @Valid @RequestBody DVism.HgZone.Auth.DTO.Request.LoginRequest loginRequest, 
            jakarta.servlet.http.HttpServletResponse httpResponse) {
        
        DVism.HgZone.Auth.DTO.Response.LoginResponse response = authService.loginUser(loginRequest);
        
        // Create the HttpOnly cookie for the refresh token
        org.springframework.http.ResponseCookie springCookie = org.springframework.http.ResponseCookie.from("refreshToken", response.getRefreshToken())
                .httpOnly(true)
                .secure(false) // Set to true when using HTTPS in production
                .path("/")
                .maxAge(30 * 24 * 60 * 60) // 30 days
                .sameSite("Lax")
                .build();
                
        httpResponse.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, springCookie.toString());
        
        // Hide the refresh token from the JSON body so it's ONLY in the secure cookie
        response.setRefreshToken(null);
        
        return ResponseEntity.ok(response);
    }
}
