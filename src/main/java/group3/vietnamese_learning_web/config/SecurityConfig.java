package group3.vietnamese_learning_web.config;

import group3.vietnamese_learning_web.service.AuthService;
import group3.vietnamese_learning_web.dto.UserResponseDTO;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.core.Authentication;

@Configuration
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);
    private final ApplicationContext applicationContext;

    public SecurityConfig(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {        http
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/login", "/register", "/css/**", "/js/**", "/images/**", "/favicon.ico")
                        .permitAll()
                        .requestMatchers("/adminpage").authenticated() // Ensure adminpage is accessible for authenticated users
                        .anyRequest().authenticated()).formLogin(form -> form
                        .loginPage("/login")
                        .defaultSuccessUrl("/dashboard", true)
                        .permitAll()
                        .successHandler(new AuthenticationSuccessHandler() {
                            @Override
                            public void onAuthenticationSuccess(HttpServletRequest request,
                                    HttpServletResponse response, Authentication authentication)
                                    throws java.io.IOException, ServletException {
                                
                                String username = authentication.getName();
                                logger.info("User '{}' logged in successfully.", username);
                                  try {
                                    // Get AuthService from ApplicationContext to avoid circular dependency
                                    AuthService authService = applicationContext.getBean(AuthService.class);
                                    // Get user details to check email
                                    UserResponseDTO user = authService.getUserByUsername(username);
                                    String email = user.getEmail();
                                    
                                    // Check if email matches admin pattern: contains "@adm" and "VLG"
                                    if (email != null && email.contains("@adm") && email.contains("VLG")) {
                                        logger.info("Admin user '{}' with email '{}' redirected to /adminpage", username, email);
                                        response.sendRedirect("/adminpage");
                                    } else {
                                        logger.info("Regular user '{}' with email '{}' redirected to /dashboard", username, email);
                                        response.sendRedirect("/dashboard");
                                    }
                                } catch (Exception e) {
                                    logger.error("Error checking user email for '{}': {}", username, e.getMessage());
                                    // Fallback to dashboard if there's an error
                                    response.sendRedirect("/dashboard");
                                }
                            }
                        }))
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout"));
        return http.build();
    }
}

// filter chain,