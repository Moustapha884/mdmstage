package com.stage.mdm.controller;

import com.stage.mdm.model.Admin;
import com.stage.mdm.repository.AdminRepository;
import com.stage.mdm.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AdminRepository adminRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            AdminRepository adminRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder
    ) {
        this.adminRepository = adminRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {

        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        if (isBlank(username) || isBlank(password)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Nom d'utilisateur et mot de passe obligatoires"
            ));
        }

        Optional<Admin> adminOptional = adminRepository.findByUsername(username);

        if (adminOptional.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Identifiants incorrects"
            ));
        }

        Admin admin = adminOptional.get();

        boolean passwordValid =
                password.equals(admin.getPassword()) ||
                passwordEncoder.matches(password, admin.getPassword());

        if (!passwordValid) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Identifiants incorrects"
            ));
        }

        String role = isBlank(admin.getRole()) ? "ADMIN" : admin.getRole();
        String token = jwtService.generateAdminToken(admin.getUsername(), role);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Connexion réussie");
        response.put("username", admin.getUsername());
        response.put("role", role);
        response.put("tokenType", "Bearer");
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}