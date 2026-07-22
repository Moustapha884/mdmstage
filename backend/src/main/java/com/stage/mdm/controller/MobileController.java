package com.stage.mdm.controller;

import com.stage.mdm.model.App;
import com.stage.mdm.model.Device;
import com.stage.mdm.model.DeviceProfile;
import com.stage.mdm.model.MdmProfile;
import com.stage.mdm.model.ProfileApp;
import com.stage.mdm.repository.DeviceProfileRepository;
import com.stage.mdm.repository.DeviceRepository;
import com.stage.mdm.repository.ProfileAppRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/mobile")
@CrossOrigin(origins = "*")
public class MobileController {

    private final DeviceRepository deviceRepository;
    private final DeviceProfileRepository deviceProfileRepository;
    private final ProfileAppRepository profileAppRepository;

    public MobileController(
            DeviceRepository deviceRepository,
            DeviceProfileRepository deviceProfileRepository,
            ProfileAppRepository profileAppRepository
    ) {
        this.deviceRepository = deviceRepository;
        this.deviceProfileRepository = deviceProfileRepository;
        this.profileAppRepository = profileAppRepository;
    }

    @GetMapping("/device/imei/{imei}")
    public ResponseEntity<?> getDeviceInformationByImei(@PathVariable String imei) {

        Optional<Device> deviceOptional = deviceRepository.findByImei(imei);

        if (deviceOptional.isEmpty()) {
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("found", false);
            response.put("message", "Aucun appareil trouvé avec cet IMEI");
            response.put("imei", imei);

            return ResponseEntity.status(404).body(response);
        }

        Device device = deviceOptional.get();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("found", true);
        response.put("message", "Appareil trouvé");

        Map<String, Object> deviceData = new LinkedHashMap<>();
        deviceData.put("id", device.getId());
        deviceData.put("deviceIdentifier", device.getDeviceIdentifier());
        deviceData.put("imei", device.getImei());
        deviceData.put("brand", device.getBrand());
        deviceData.put("model", device.getModel());
        deviceData.put("os", device.getOs());
        deviceData.put("status", device.getStatus());
        deviceData.put("enrolledAt", device.getEnrolledAt());

        response.put("device", deviceData);

        Optional<DeviceProfile> deviceProfileOptional =
                deviceProfileRepository.findFirstByDevice_IdAndActiveTrueOrderByAssignedAtDesc(device.getId());

        if (deviceProfileOptional.isEmpty()) {
            response.put("profile", null);
            response.put("apps", new ArrayList<>());
            response.put("profileFound", false);
            response.put("messageProfile", "Aucun profil actif associé à cet appareil");

            return ResponseEntity.ok(response);
        }

        DeviceProfile deviceProfile = deviceProfileOptional.get();
        MdmProfile profile = deviceProfile.getProfile();

        Map<String, Object> profileData = new LinkedHashMap<>();
        profileData.put("id", profile.getId());
        profileData.put("name", profile.getName());
        profileData.put("description", profile.getDescription());
        profileData.put("status", profile.getStatus());
        profileData.put("createdAt", profile.getCreatedAt());
        profileData.put("assignedAt", deviceProfile.getAssignedAt());
        profileData.put("active", deviceProfile.isActive());

        response.put("profileFound", true);
        response.put("profile", profileData);

        List<ProfileApp> profileApps = profileAppRepository.findByProfile_Id(profile.getId());

        List<Map<String, Object>> appsData = new ArrayList<>();

        for (ProfileApp profileApp : profileApps) {
            App app = profileApp.getApp();

            Map<String, Object> appData = new LinkedHashMap<>();
            appData.put("id", app.getId());
            appData.put("name", app.getName());
            appData.put("packageName", app.getPackageName());
            appData.put("version", app.getVersion());
            appData.put("type", app.getType());
            appData.put("status", app.getStatus());
            appData.put("apkUrl", app.getApkUrl());
            appData.put("apkOriginalName", app.getApkOriginalName());
            appData.put("apkSize", app.getApkSize());
            appData.put("required", profileApp.isRequired());
            appData.put("addedAt", profileApp.getAddedAt());

            appsData.add(appData);
        }

        response.put("apps", appsData);
        response.put("appsCount", appsData.size());

        return ResponseEntity.ok(response);
    }
}