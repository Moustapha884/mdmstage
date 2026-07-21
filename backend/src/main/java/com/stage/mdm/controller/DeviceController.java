package com.stage.mdm.controller;

import com.stage.mdm.model.Alert;
import com.stage.mdm.model.Command;
import com.stage.mdm.model.Device;
import com.stage.mdm.model.DeviceProfile;
import com.stage.mdm.repository.AlertRepository;
import com.stage.mdm.repository.CommandRepository;
import com.stage.mdm.repository.DeviceProfileRepository;
import com.stage.mdm.repository.DeviceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = "http://localhost:4200")
public class DeviceController {

    private final DeviceRepository deviceRepository;
    private final DeviceProfileRepository deviceProfileRepository;
    private final AlertRepository alertRepository;
    private final CommandRepository commandRepository;

    public DeviceController(
            DeviceRepository deviceRepository,
            DeviceProfileRepository deviceProfileRepository,
            AlertRepository alertRepository,
            CommandRepository commandRepository
    ) {
        this.deviceRepository = deviceRepository;
        this.deviceProfileRepository = deviceProfileRepository;
        this.alertRepository = alertRepository;
        this.commandRepository = commandRepository;
    }

    @GetMapping
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDeviceById(@PathVariable Long id) {
        Optional<Device> device = deviceRepository.findById(id);

        if (device.isPresent()) {
            return ResponseEntity.ok(device.get());
        }

        return ResponseEntity.status(404).body(Map.of(
                "message", "Appareil introuvable"
        ));
    }

    @PostMapping
    public ResponseEntity<?> createDevice(@RequestBody Device device) {
        Device savedDevice = deviceRepository.save(device);

        return ResponseEntity.ok(savedDevice);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDevice(
            @PathVariable Long id,
            @RequestBody Device newDevice
    ) {
        Optional<Device> deviceOptional = deviceRepository.findById(id);

        if (deviceOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Appareil introuvable"
            ));
        }

        Device device = deviceOptional.get();

        device.setDeviceIdentifier(newDevice.getDeviceIdentifier());
        device.setBrand(newDevice.getBrand());
        device.setModel(newDevice.getModel());
        device.setOs(newDevice.getOs());
        device.setStatus(newDevice.getStatus());

        Device updatedDevice = deviceRepository.save(device);

        return ResponseEntity.ok(updatedDevice);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDevice(@PathVariable Long id) {
        Optional<Device> device = deviceRepository.findById(id);

        if (device.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Appareil introuvable"
            ));
        }

        List<DeviceProfile> linkedDeviceProfiles = deviceProfileRepository.findAll()
                .stream()
                .filter(item ->
                        item.getDevice() != null &&
                        item.getDevice().getId() != null &&
                        item.getDevice().getId().equals(id)
                )
                .toList();

        List<Alert> linkedAlerts = alertRepository.findAll()
                .stream()
                .filter(item ->
                        item.getDevice() != null &&
                        item.getDevice().getId() != null &&
                        item.getDevice().getId().equals(id)
                )
                .toList();

        List<Command> linkedCommands = commandRepository.findAll()
                .stream()
                .filter(item ->
                        item.getDevice() != null &&
                        item.getDevice().getId() != null &&
                        item.getDevice().getId().equals(id)
                )
                .toList();

        deviceProfileRepository.deleteAll(linkedDeviceProfiles);
        alertRepository.deleteAll(linkedAlerts);
        commandRepository.deleteAll(linkedCommands);

        deviceRepository.deleteById(id);

        return ResponseEntity.ok(Map.of(
                "message", "Appareil supprimé avec succès"
        ));
    }
}