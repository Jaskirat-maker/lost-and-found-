package edu.college.lostfound.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final AppProperties props;

    public WebConfig(AppProperties props) {
        this.props = props;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String publicPath = props.getUpload().getPublicPath();
        if (!publicPath.endsWith("/")) {
            publicPath = publicPath + "/";
        }
        Path uploadDir = Path.of(props.getUpload().getDir()).toAbsolutePath().normalize();
        registry.addResourceHandler(publicPath + "**")
                .addResourceLocations(uploadDir.toUri().toString());
    }
}

