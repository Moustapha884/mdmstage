package com.stage.mdm.controller;

import com.stage.mdm.model.Device;
import com.stage.mdm.model.DeviceProfile;
import com.stage.mdm.model.MdmProfile;
import com.stage.mdm.repository.DeviceProfileRepository;
import com.stage.mdm.repository.DeviceRepository;
import com.stage.mdm.repository.MdmProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/device-profiles")
@CrossOrigin(origins = "http://localhost:4200")
public class DeviceProfileController {

    private final DeviceProfileRepository deviceProfileRepository;
    private final DeviceRepository deviceRepository;
    private final MdmProfileRepository profileRepository;

    public DeviceProfileController(
            DeviceProfileRepository deviceProfileRepository,
            DeviceRepository deviceRepository,
            MdmProfileRepository profileRepository
    ) {
        this.deviceProfileRepository = deviceProfileRepository;
        this.deviceRepository = deviceRepository;
        this.profileRepository = profileRepository;
    }

    @GetMapping
    public List<DeviceProfile> getAllDeviceProfiles() {
        return deviceProfileRepository.findAll();
    }

    @GetMapping("/device/{deviceId}")
    public ResponseEntity<?> getProfileByDevice(@PathVariable Long deviceId) {
        Optional<Device> device = deviceRepository.findById(deviceId);

        if (device.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Appareil introuvable"
            ));
        }

        Optional<DeviceProfile> deviceProfile = deviceProfileRepository.findByDevice_Id(deviceId);

        if (deviceProfile.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Aucun profil affecté à cet appareil"
            ));
        }

        return ResponseEntity.ok(deviceProfile.get());
    }

    @PostMapping
    public ResponseEntity<?> assignProfileToDevice(
            @RequestParam Long deviceId,
            @RequestParam Long profileId,
            @RequestParam(defaultValue = "true") boolean active
    ) {
        Optional<Device> device = deviceRepository.findById(deviceId);
        Optional<MdmProfile> profile = profileRepository.findById(profileId);

        if (device.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Appareil introuvable"
            ));
        }

        if (profile.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Profil introuvable"
            ));
        }

        /*
         * Nouveau logique :
         * Un appareil doit avoir un seul profil.
         * Si l'appareil a déjà un profil, on le remplace.
         */
        DeviceProfile deviceProfile = deviceProfileRepository
                .findByDevice_Id(deviceId)
                .orElse(new DeviceProfile());

        deviceProfile.setDevice(device.get());
        deviceProfile.setProfile(profile.get());
        deviceProfile.setActive(active);

        DeviceProfile savedDeviceProfile = deviceProfileRepository.save(deviceProfile);

        return ResponseEntity.ok(savedDeviceProfile);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDeviceProfile(
            @PathVariable Long id,
            @RequestParam Long deviceId,
            @RequestParam Long profileId,
            @RequestParam(defaultValue = "true") boolean active
    ) {
        Optional<DeviceProfile> deviceProfileOptional = deviceProfileRepository.findById(id);
        Optional<Device> device = deviceRepository.findById(deviceId);
        Optional<MdmProfile> profile = profileRepository.findById(profileId);

        if (deviceProfileOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Association introuvable"
            ));
        }

        if (device.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Appareil introuvable"
            ));
        }

        if (profile.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Profil introuvable"
            ));
        }

        DeviceProfile deviceProfile = deviceProfileOptional.get();
        deviceProfile.setDevice(device.get());
        deviceProfile.setProfile(profile.get());
        deviceProfile.setActive(active);

        return ResponseEntity.ok(deviceProfileRepository.save(deviceProfile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDeviceProfile(@PathVariable Long id) {
        Optional<DeviceProfile> deviceProfile = deviceProfileRepository.findById(id);

        if (deviceProfile.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Association introuvable"
            ));
        }

        deviceProfileRepository.deleteById(id);

        return ResponseEntity.ok(Map.of(
                "message", "Association supprimée avec succès"
        ));
    }
}