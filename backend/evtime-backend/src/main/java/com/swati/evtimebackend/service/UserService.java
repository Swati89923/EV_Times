package com.swati.evtimebackend.service;

import com.swati.evtimebackend.entity.User;
import com.swati.evtimebackend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import java.util.Optional;
import com.swati.evtimebackend.security.JwtUtil;
import com.swati.evtimebackend.dto.UserResponseDTO;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            JwtUtil jwtUtil,
            BCryptPasswordEncoder passwordEncoder){

        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user){

        user.setRole("USER");

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        User saved = userRepository.save(user);
        log.info("New user registered: {}", saved.getEmail());
        return saved;
    }

    public UserResponseDTO loginUser(String email, String password){

        // NOTE: never log email/password/hash values here — the previous
        // implementation printed the raw email and the bcrypt hash to
        // stdout on every login attempt, which is a credential-adjacent
        // data leak into log files.
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty() || !passwordEncoder.matches(password, user.get().getPassword())) {
            log.warn("Failed login attempt for email={}", email);
            throw new BadCredentialsException("Invalid email or password.");
        }

        String token = jwtUtil.generateToken(email, user.get().getRole());
        log.info("User logged in: {}", email);

        return new UserResponseDTO(
                token,
                user.get().getEmail(),
                user.get().getRole()
        );
    }

    public java.util.List<com.swati.evtimebackend.dto.AdminUserDTO> listUsers() {
        return userRepository.findAll().stream()
                .map(u -> new com.swati.evtimebackend.dto.AdminUserDTO(u.getId(), u.getName(), u.getEmail(), u.getRole()))
                .toList();
    }

    public void deleteUser(Long id, String requesterEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new com.swati.evtimebackend.exception.ResourceNotFoundException("User not found with id " + id));

        if (user.getEmail() != null && user.getEmail().equalsIgnoreCase(requesterEmail)) {
            throw new com.swati.evtimebackend.exception.BadRequestException("You can't delete your own account while logged in as it.");
        }

        userRepository.deleteById(id);
        log.info("User id={} ({}) deleted by admin {}", id, user.getEmail(), requesterEmail);
    }
}
