package edu.college.lostfound.security;

import edu.college.lostfound.config.AppProperties;
import edu.college.lostfound.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class JwtService {
    private final AppProperties props;
    private SecretKey key;

    public JwtService(AppProperties props) {
        this.props = props;
    }

    @PostConstruct
    void init() {
        String secret = props.getJwt().getSecret();
        byte[] bytes;
        // Allow either raw string or base64 string
        if (secret != null && secret.startsWith("base64:")) {
            bytes = Decoders.BASE64.decode(secret.substring("base64:".length()));
        } else {
            bytes = secret == null ? new byte[0] : secret.getBytes(StandardCharsets.UTF_8);
        }
        if (bytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET is too short. Use at least 32 bytes (256-bit) for HS256. " +
                    "Tip: set JWT_SECRET=base64:<32+ bytes base64> or a long random string.");
        }
        this.key = Keys.hmacShaKeyFor(bytes);
    }

    public String generateToken(User user) {
        Instant now = Instant.now();
        Instant exp = now.plus(props.getJwt().getExpirationMinutes(), ChronoUnit.MINUTES);
        return Jwts.builder()
                .issuer(props.getJwt().getIssuer())
                .subject(user.getEmail())
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .claim("role", user.getRole().name())
                .signWith(key)
                .compact();
    }

    public String extractSubject(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

