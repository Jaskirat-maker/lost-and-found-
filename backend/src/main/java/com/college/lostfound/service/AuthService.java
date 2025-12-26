package com.college.lostfound.service;

import com.college.lostfound.config.AppProperties;
import com.college.lostfound.dto.AuthResponse;
import com.college.lostfound.dto.LoginRequest;
import com.college.lostfound.dto.RegisterRequest;
import com.college.lostfound.dto.UserDto;
import com.college.lostfound.model.User;
import com.college.lostfound.model.Role;
import com.college.lostfound.exception.BadRequestException;
import com.college.lostfound.repository.UserRepository;
import com.college.lostfound.security.JwtService;
import com.college.lostfound.util.DtoMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AppProperties props;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            AppProperties props
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.props = props;
    }

    public AuthResponse register(RegisterRequest req) {
        String email = normalizeEmail(req.getEmail());
        validateCollegeEmail(email);
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email already registered");
        }

        User user = new User();
        user.setName(req.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);

        String token = jwtService.generateToken(user);
        UserDto userDto = DtoMapper.toUserDto(user);
        return new AuthResponse(token, userDto);
    }

    public AuthResponse login(LoginRequest req) {
        String email = normalizeEmail(req.getEmail());
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, req.getPassword()));
        User user = userRepository.findByEmail(email).orElseThrow(() -> new BadRequestException("Invalid credentials"));
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, DtoMapper.toUserDto(user));
    }

    private String normalizeEmail(String email) {
        if (email == null) return "";
        return email.trim().toLowerCase();
    }

    private void validateCollegeEmail(String email) {
        String domain = props.getCollegeEmailDomain();
        if (domain == null || domain.isBlank()) {
            return;
        }
        int at = email.lastIndexOf('@');
        if (at < 0) {
            throw new BadRequestException("Email must be a valid college email");
        }
        String emailDomain = email.substring(at + 1);
        if (!emailDomain.equalsIgnoreCase(domain) && !emailDomain.toLowerCase().endsWith("." + domain.toLowerCase())) {
            throw new BadRequestException("Registration requires a college email (@" + domain + ")");
        }
    }
}

