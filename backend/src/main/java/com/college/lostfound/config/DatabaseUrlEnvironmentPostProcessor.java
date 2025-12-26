package com.college.lostfound.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.Map;

/**
 * Render and some platforms expose Postgres as a URL like:
 * postgres://user:pass@host:5432/db
 *
 * JDBC expects:
 * jdbc:postgresql://host:5432/db
 *
 * This post-processor normalizes spring.datasource.url early during startup.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {
    private static final String SPRING_DS_URL = "spring.datasource.url";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String url = environment.getProperty(SPRING_DS_URL);
        if (url == null || url.isBlank()) return;

        String normalized = normalize(url.trim());
        if (normalized.equals(url.trim())) return;

        environment.getPropertySources().addFirst(
                new MapPropertySource("dbUrlNormalizer", Map.of(SPRING_DS_URL, normalized))
        );
    }

    private String normalize(String url) {
        if (url.startsWith("jdbc:")) return url;
        if (url.startsWith("postgres://")) {
            return "jdbc:postgresql://" + url.substring("postgres://".length());
        }
        if (url.startsWith("postgre://")) {
            return "jdbc:postgresql://" + url.substring("postgre://".length());
        }
        return url;
    }

    @Override
    public int getOrder() {
        // Run early
        return Ordered.HIGHEST_PRECEDENCE;
    }
}

