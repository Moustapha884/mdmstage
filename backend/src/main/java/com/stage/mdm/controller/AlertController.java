package com.stage.mdm.controller;

import com.stage.mdm.model.Alert;
import com.stage.mdm.model.Device;
import com.stage.mdm.repository.AlertRepository;
import com.stage.mdm.repository.DeviceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "http://localhost:4200")
public class AlertController {

    private final AlertRepository alertRepository;
    private final DeviceRepository deviceRepository;

    public AlertController(AlertRepository alertRepository, DeviceRepository deviceRepository) {
        this.alertRepository = alertRepository;
        this.deviceRepository = deviceRepository;
    }

    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAlertById(@PathVariable Long id) {
        Optional<Alert> alert = alertRepository.findById(id);

        if (alert.isPresent()) {
            return ResponseEntity.ok(alert.get());
        }

        return ResponseEntity.status(404).body(Map.of(
                "message", "Alerte introuvable"
        ));
    }

    @PostMapping
    public ResponseEntity<?> createAlert(
            @RequestParam Long deviceId,
            @RequestBody Alert alert
    ) {
        Optional<Device> device = deviceRepository.findById(deviceId);

        if (device.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Appareil introuvable"
            ));
        }

        alert.setDevice(device.get());

        if (alert.getCreatedAt() == null) {
            alert.setCreatedAt(LocalDateTime.now());
        }

        if (alert.getStatus() == null || alert.getStatus().isBlank()) {
            alert.setStatus("NEW");
        }

        if (alert.getSeverity() == null || alert.getSeverity().isBlank()) {
            alert.setSeverity("MEDIUM");
        }

        Alert savedAlert = alertRepository.save(alert);
        return ResponseEntity.ok(savedAlert);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAlert(
            @PathVariable Long id,
            @RequestParam Long deviceId,
            @RequestBody Alert alertDetails
    ) {
        Optional<Alert> alertOptional = alertRepository.findById(id);
        Optional<Device> deviceOptional = deviceRepository.findById(deviceId);

        if (alertOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Alerte introuvable"
            ));
        }

        if (deviceOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Appareil introuvable"
            ));
        }

        Alert alert = alertOptional.get();

        alert.setType(alertDetails.getType());
        alert.setSeverity(alertDetails.getSeverity());
        alert.setStatus(alertDetails.getStatus());
        alert.setMessage(alertDetails.getMessage());
        alert.setAdminResponse(alertDetails.getAdminResponse());
        alert.setDevice(deviceOptional.get());

        if ("RESOLVED".equalsIgnoreCase(alertDetails.getStatus())) {
            alert.setResolvedAt(LocalDateTime.now());
        }

        Alert updatedAlert = alertRepository.save(alert);
        return ResponseEntity.ok(updatedAlert);
    }

    @PutMapping("/{id}/response")
    public ResponseEntity<?> respondToAlert(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {
        Optional<Alert> alertOptional = alertRepository.findById(id);

        if (alertOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Alerte introuvable"
            ));
        }

        Alert alert = alertOptional.get();

        String adminResponse = request.get("adminResponse");
        String status = request.get("status");

        if (adminResponse != null) {
            alert.setAdminResponse(adminResponse);
        }

        if (status != null && !status.isBlank()) {
            alert.setStatus(status);

            if ("RESOLVED".equalsIgnoreCase(status)) {
                alert.setResolvedAt(LocalDateTime.now());
            }
        }

        Alert updatedAlert = alertRepository.save(alert);

        return ResponseEntity.ok(updatedAlert);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAlert(@PathVariable Long id) {
        Optional<Alert> alert = alertRepository.findById(id);

        if (alert.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Alerte introuvable"
            ));
        }

        alertRepository.deleteById(id);

        return ResponseEntity.ok(Map.of(
                "message", "Alerte supprimée avec succès"
        ));
    }
}