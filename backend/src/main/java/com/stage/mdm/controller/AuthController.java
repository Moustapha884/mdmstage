package com.stage.mdm.controller;

import com.stage.mdm.model.Admin;
import com.stage.mdm.repository.AdminRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AdminRepository adminRepository;

    public AuthController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        String username = request.get("username");
        String password = request.get("password");

        Optional<Admin> admin = adminRepository.findByUsernameAndPassword(username, password);

        if (admin.isPresent()) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Connexion réussie",
                    "adminId", admin.get().getId(),
                    "username", admin.get().getUsername(),
                    "role", admin.get().getRole()
            ));
        }

        return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "message", "Nom d'utilisateur ou mot de passe incorrect"
        ));
    }
}