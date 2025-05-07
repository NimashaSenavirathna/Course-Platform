package com.example.socialmedia.controller;

import com.example.socialmedia.model.User;
import com.example.socialmedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User loginData) {
        User user = userRepository.findByEmail(loginData.getEmail()).orElse(null);
        if (user != null && user.getPassword().equals(loginData.getPassword())) {
            return "Login successful (JWT not implemented in this stub)";
        }
        return "Invalid credentials";
    }
}
