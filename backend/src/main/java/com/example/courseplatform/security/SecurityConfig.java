package com.example.courseplatform.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig implements WebMvcConfigurer {

    // Global CORS configuration
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000") // Allow React frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    // Spring Security configuration
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults()) // Enable CORS for Spring Security
                .csrf(csrf -> csrf.disable()) // Disable CSRF for development
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/courses/**").permitAll() // Allow public access to courses
                        .requestMatchers("/api/cart/**").permitAll() // Allow public access to cart
                        .requestMatchers("/api/admin/**").permitAll() // Allow public access to admin endpoints
                        .requestMatchers("/api/payment/**").permitAll() // Allow public access to payment endpoints
                        .anyRequest().authenticated()
                )
                .formLogin(withDefaults()); // Enable default login form

        return http.build();
    }

    // In-memory user for testing
    @Bean
    public UserDetailsService userDetailsService() {
        String adminUsername = System.getenv("ADMIN_USERNAME");
        String adminPassword = System.getenv("ADMIN_PASSWORD");
        
        if (adminUsername == null || adminPassword == null) {
            throw new IllegalStateException("Admin credentials not configured in environment variables");
        }

        UserDetails user = User.withDefaultPasswordEncoder()
                .username(adminUsername)
                .password(adminPassword)
                .roles("USER")
                .build();

        return new InMemoryUserDetailsManager(user);
    }
}
