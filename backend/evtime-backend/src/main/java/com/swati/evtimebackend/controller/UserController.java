package com.swati.evtimebackend.controller;

import com.swati.evtimebackend.dto.SignupResponseDTO;
import com.swati.evtimebackend.dto.UserResponseDTO;
import com.swati.evtimebackend.entity.User;
import com.swati.evtimebackend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/signup")
    public SignupResponseDTO signup(
            @Valid @RequestBody User user){

        // Note: the role a client submits here is ignored — UserService
        // always assigns "USER" on registration regardless of what's in
        // the request body, so self-service admin signup isn't possible
        // even though the User entity has a settable role field.
        User savedUser = userService.registerUser(user);

        return new SignupResponseDTO(
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    @PostMapping("/login")
    public UserResponseDTO loginUser(
            @RequestBody User user){

        return userService.loginUser(
                user.getEmail(),
                user.getPassword()
        );
    }

    @GetMapping("/admin/users")
    public java.util.List<com.swati.evtimebackend.dto.AdminUserDTO> listUsers() {
        return userService.listUsers();
    }

    @DeleteMapping("/admin/users/{id}")
    public org.springframework.http.ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            org.springframework.security.core.Authentication authentication
    ) {
        userService.deleteUser(id, authentication.getName());
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}