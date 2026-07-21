package com.stage.mdm;

import com.stage.mdm.model.Admin;
import com.stage.mdm.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;

    public DatabaseSeeder(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (adminRepository.count() == 0) {
            Admin defaultAdmin = new Admin();
            defaultAdmin.setUsername("admin");
            defaultAdmin.setPassword("admin123"); // Mot de passe par défaut
            defaultAdmin.setRole("ADMIN");
            defaultAdmin.setCreatedAt(LocalDateTime.now());
            adminRepository.save(defaultAdmin);
            System.out.println("==================================================");
            System.out.println("Administrateur par defaut cree : admin / admin123");
            System.out.println("==================================================");
        }
    }
}
