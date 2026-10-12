package com.cloudrecon.web;

import com.cloudrecon.model.AppUser;
import com.cloudrecon.model.Repos.UserRepository;
import com.cloudrecon.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    public record LoginRequest(String email, String password) {}
    public record RegisterRequest(String name, String email, String password) {}
    public record AuthResponse(String token, String email, String name) {}

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users; this.encoder = encoder; this.jwt = jwt;

// TODO: Complete remaining logic for this module (WIP Week 5)
