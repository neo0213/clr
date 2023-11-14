package codexperk.clr;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // CORS mapping for all endpoints
                        .allowedOrigins("*") // Allow any origin to access the resources
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow GET, POST, PUT, DELETE, OPTIONS methods
                        .allowedHeaders("*") // Allow any header
                        .exposedHeaders("header1", "header2") // Expose additional headers
                        .allowedOriginPatterns() // Allow cookies to be sent with the request
                        .maxAge(3600); // Cache preflight response for 1 hour
            }
        };
    }
}
