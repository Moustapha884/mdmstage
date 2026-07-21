package com.stage.mdm.controller;

import com.stage.mdm.model.App;
import com.stage.mdm.model.MdmProfile;
import com.stage.mdm.model.ProfileApp;
import com.stage.mdm.repository.AppRepository;
import com.stage.mdm.repository.MdmProfileRepository;
import com.stage.mdm.repository.ProfileAppRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile-apps")
@CrossOrigin(origins = "http://localhost:4200")
public class ProfileAppController {

    private final ProfileAppRepository profileAppRepository;
    private final MdmProfileRepository profileRepository;
    private final AppRepository appRepository;

    public ProfileAppController(
            ProfileAppRepository profileAppRepository,
            MdmProfileRepository profileRepository,
            AppRepository appRepository
    ) {
        this.profileAppRepository = profileAppRepository;
        this.profileRepository = profileRepository;
        this.appRepository = appRepository;
    }

    @GetMapping
    public List<ProfileApp> getAllProfileApps() {
        return profileAppRepository.findAll();
    }

    @GetMapping("/profile/{profileId}")
    public ResponseEntity<?> getAppsByProfile(@PathVariable Long profileId) {
        Optional<MdmProfile> profile = profileRepository.findById(profileId);

        if (profile.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Profil introuvable"
            ));
        }

        return ResponseEntity.ok(profileAppRepository.findByProfile_Id(profileId));
    }

    @PostMapping
    public ResponseEntity<?> addOneAppToProfile(
            @RequestParam Long profileId,
            @RequestParam Long appId,
            @RequestParam(defaultValue = "true") boolean required
    ) {
        Optional<MdmProfile> profile = profileRepository.findById(profileId);
        Optional<App> app = appRepository.findById(appId);

        if (profile.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Profil introuvable"
            ));
        }

        if (app.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Application introuvable"
            ));
        }

        ProfileApp profileApp = new ProfileApp();
        profileApp.setProfile(profile.get());
        profileApp.setApp(app.get());
        profileApp.setRequired(required);

        return ResponseEntity.ok(profileAppRepository.save(profileApp));
    }

    @PostMapping("/profile/{profileId}/apps")
    public ResponseEntity<?> replaceAppsForProfile(
            @PathVariable Long profileId,
            @RequestBody Map<String, List<Long>> request
    ) {
        Optional<MdmProfile> profile = profileRepository.findById(profileId);

        if (profile.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Profil introuvable"
            ));
        }

        List<Long> appIds = request.get("appIds");

        if (appIds == null || appIds.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "La liste des applications est vide"
            ));
        }

        List<ProfileApp> oldApps = profileAppRepository.findByProfile_Id(profileId);
        profileAppRepository.deleteAll(oldApps);

        List<ProfileApp> newProfileApps = new ArrayList<>();

        for (Long appId : appIds) {
            Optional<App> app = appRepository.findById(appId);

            if (app.isPresent()) {
                ProfileApp profileApp = new ProfileApp();
                profileApp.setProfile(profile.get());
                profileApp.setApp(app.get());
                profileApp.setRequired(true);
                newProfileApps.add(profileApp);
            }
        }

        List<ProfileApp> savedApps = profileAppRepository.saveAll(newProfileApps);

        return ResponseEntity.ok(savedApps);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProfileApp(@PathVariable Long id) {
        Optional<ProfileApp> profileApp = profileAppRepository.findById(id);

        if (profileApp.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Association introuvable"
            ));
        }

        profileAppRepository.deleteById(id);

        return ResponseEntity.ok(Map.of(
                "message", "Association supprimée avec succès"
        ));
    }
}