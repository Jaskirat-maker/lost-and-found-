package com.college.lostfound.controller;

import com.college.lostfound.dto.AuthResponse;
import com.college.lostfound.dto.LoginRequest;
import com.college.lostfound.dto.RegisterRequest;
import com.college.lostfound.dto.UserDto;
import com.college.lostfound.service.AuthService;
import com.college.lostfound.service.UserService;
import com.college.lostfound.util.DtoMapper;
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

