package edu.college.lostfound.controller;

import edu.college.lostfound.dto.AuthResponse;
import edu.college.lostfound.dto.LoginRequest;
import edu.college.lostfound.dto.RegisterRequest;
import edu.college.lostfound.dto.UserDto;
import edu.college.lostfound.service.AuthService;
import edu.college.lostfound.service.UserService;
import edu.college.lostfound.util.DtoMapper;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        return authService.register(req);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @GetMapping("/me")
    public UserDto me() {
        return DtoMapper.toUserDto(userService.getCurrentUser());
    }
}

