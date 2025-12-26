package edu.college.lostfound.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String collegeEmailDomain;
    private Jwt jwt = new Jwt();
    private Cors cors = new Cors();
    private Upload upload = new Upload();
    private Mail mail = new Mail();

    @Getter
    @Setter
    public static class Jwt {
        private String issuer;
        private String secret;
        private long expirationMinutes;
    }

    @Getter
    @Setter
    public static class Cors {
        /**
         * Comma-separated list of allowed origins (e.g. http://localhost:5173,https://your-app.vercel.app)
         */
        private String allowedOrigins;
    }

    @Getter
    @Setter
    public static class Upload {
        private String dir;
        private String publicPath;
    }

    @Getter
    @Setter
    public static class Mail {
        private String from;
    }
}

