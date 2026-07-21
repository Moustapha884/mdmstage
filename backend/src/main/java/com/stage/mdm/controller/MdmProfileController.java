package com.stage.mdm.controller;

import com.stage.mdm.model.DeviceProfile;
import com.stage.mdm.model.MdmProfile;
import com.stage.mdm.model.ProfileApp;
import com.stage.mdm.repository.DeviceProfileRepository;
import com.stage.mdm.repository.MdmProfileRepository;
import com.stage.mdm.repository.ProfileAppRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "http://localhost:4200")
public class MdmProfileController {

    private final MdmProfileRepository mdmProfileRepository;
    private final ProfileAppRepository profileAppRepository;
    private final DeviceProfileRepository deviceProfileRepository;

    public MdmProfileController(
            MdmProfileRepository mdmProfileRepository,
            ProfileAppRepository profileAppRepository,
            DeviceProfileRepository deviceProfileRepository
    ) {
        this.mdmProfileRepository = mdmProfileRepository;
        this.profileAppRepository = profileAppRepository;
        this.deviceProfileRepository = deviceProfileRepository;
    }

    @GetMapping
    public List<MdmProfile> getAllProfiles() {
        return mdmProfileRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProfileById(@PathVariable Long id) {
        Optional<MdmProfile> profile = mdmProfileRepository.findById(id);

        if (profile.isPresent()) {
            return ResponseEntity.ok(profile.get());
        }

        return ResponseEntity.status(404).body(Map.of(
                "message", "Profil MDM introuvable"
        ));
    }

    @PostMapping
    public ResponseEntity<?> createProfile(@RequestBody MdmProfile profile) {
        MdmProfile savedProfile = mdmProfileRepository.save(profile);

        return ResponseEntity.ok(savedProfile);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody MdmProfile newProfile
    ) {
        Optional<MdmProfile> profileOptional = mdmProfileRepository.findById(id);

        if (profileOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Profil MDM introuvable"
            ));
        }

        MdmProfile profile = profileOptional.get();

        profile.setName(newProfile.getName());
        profile.setDescription(newProfile.getDescription());
        profile.setStatus(newProfile.getStatus());

        MdmProfile updatedProfile = mdmProfileRepository.save(profile);

        return ResponseEntity.ok(updatedProfile);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProfile(@PathVariable Long id) {
        Optional<MdmProfile> profile = mdmProfileRepository.findById(id);

        if (profile.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Profil MDM introuvable"
            ));
        }

        List<ProfileApp> linkedProfileApps = profileAppRepository.findByProfile_Id(id);
        List<DeviceProfile> linkedDeviceProfiles = deviceProfileRepository.findByProfile_Id(id);

        profileAppRepository.deleteAll(linkedProfileApps);
        deviceProfileRepository.deleteAll(linkedDeviceProfiles);

        mdmProfileRepository.deleteById(id);

        return ResponseEntity.ok(Map.of(
                "message", "Profil MDM supprimé avec succès"
        ));
    }
}