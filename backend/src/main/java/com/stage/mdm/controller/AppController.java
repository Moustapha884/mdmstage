package com.stage.mdm.controller;

import com.stage.mdm.model.App;
import com.stage.mdm.model.ProfileApp;
import com.stage.mdm.repository.AppRepository;
import com.stage.mdm.repository.ProfileAppRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/apps")
@CrossOrigin(origins = "http://localhost:4200")
public class AppController {

    private final AppRepository appRepository;
    private final ProfileAppRepository profileAppRepository;

    public AppController(
            AppRepository appRepository,
            ProfileAppRepository profileAppRepository
    ) {
        this.appRepository = appRepository;
        this.profileAppRepository = profileAppRepository;
    }

    @GetMapping
    public List<App> getAllApps() {
        return appRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppById(@PathVariable Long id) {
        Optional<App> app = appRepository.findById(id);

        if (app.isPresent()) {
            return ResponseEntity.ok(app.get());
        }

        return ResponseEntity.status(404).body(Map.of(
                "message", "Application introuvable"
        ));
    }

    @PostMapping
    public ResponseEntity<?> createApp(@RequestBody App app) {
        if (app.getCreatedAt() == null) {
            app.setCreatedAt(LocalDateTime.now());
        }

        if (app.getStatus() == null || app.getStatus().isBlank()) {
            app.setStatus("ACTIVE");
        }

        if (app.getType() == null || app.getType().isBlank()) {
            app.setType("REQUIRED");
        }

        App savedApp = appRepository.save(app);

        return ResponseEntity.ok(savedApp);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateApp(
            @PathVariable Long id,
            @RequestBody App appDetails
    ) {
        Optional<App> appOptional = appRepository.findById(id);

        if (appOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Application introuvable"
            ));
        }

        App app = appOptional.get();

        app.setName(appDetails.getName());
        app.setPackageName(appDetails.getPackageName());
        app.setVersion(appDetails.getVersion());
        app.setApkUrl(appDetails.getApkUrl());
        app.setType(appDetails.getType());
        app.setStatus(appDetails.getStatus());

        App updatedApp = appRepository.save(app);

        return ResponseEntity.ok(updatedApp);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApp(@PathVariable Long id) {
        Optional<App> app = appRepository.findById(id);

        if (app.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Application introuvable"
            ));
        }

        List<ProfileApp> linkedProfileApps = profileAppRepository.findByApp_Id(id);
        profileAppRepository.deleteAll(linkedProfileApps);

        appRepository.deleteById(id);

        return ResponseEntity.ok(Map.of(
                "message", "Application supprimée avec succès"
        ));
    }
}