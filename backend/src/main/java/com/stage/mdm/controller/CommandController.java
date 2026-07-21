package com.stage.mdm.controller;

import com.stage.mdm.model.Command;
import com.stage.mdm.model.Device;
import com.stage.mdm.repository.CommandRepository;
import com.stage.mdm.repository.DeviceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/commands")
@CrossOrigin(origins = "http://localhost:4200")
public class CommandController {

    private final CommandRepository commandRepository;
    private final DeviceRepository deviceRepository;

    public CommandController(CommandRepository commandRepository, DeviceRepository deviceRepository) {
        this.commandRepository = commandRepository;
        this.deviceRepository = deviceRepository;
    }

    @GetMapping
    public List<Command> getAllCommands() {
        return commandRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCommandById(@PathVariable Long id) {
        Optional<Command> command = commandRepository.findById(id);

        if (command.isPresent()) {
            return ResponseEntity.ok(command.get());
        }

        return ResponseEntity.status(404).body(Map.of(
                "message", "Commande introuvable"
        ));
    }

    @PostMapping
    public ResponseEntity<?> createCommand(
            @RequestParam Long deviceId,
            @RequestBody Command command
    ) {
        Optional<Device> device = deviceRepository.findById(deviceId);

        if (device.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Appareil introuvable"
            ));
        }

        command.setDevice(device.get());

        if (command.getCreatedAt() == null) {
            command.setCreatedAt(LocalDateTime.now());
        }

        if (command.getStatus() == null || command.getStatus().isBlank()) {
            command.setStatus("PENDING");
        }

        Command savedCommand = commandRepository.save(command);
        return ResponseEntity.ok(savedCommand);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCommand(
            @PathVariable Long id,
            @RequestParam Long deviceId,
            @RequestBody Command commandDetails
    ) {
        Optional<Command> commandOptional = commandRepository.findById(id);
        Optional<Device> deviceOptional = deviceRepository.findById(deviceId);

        if (commandOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Commande introuvable"
            ));
        }

        if (deviceOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Appareil introuvable"
            ));
        }

        Command command = commandOptional.get();

        command.setType(commandDetails.getType());
        command.setStatus(commandDetails.getStatus());
        command.setDescription(commandDetails.getDescription());
        command.setDevice(deviceOptional.get());

        if ("EXECUTED".equalsIgnoreCase(commandDetails.getStatus())) {
            command.setExecutedAt(LocalDateTime.now());
        }

        Command updatedCommand = commandRepository.save(command);
        return ResponseEntity.ok(updatedCommand);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCommand(@PathVariable Long id) {
        Optional<Command> command = commandRepository.findById(id);

        if (command.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Commande introuvable"
            ));
        }

        commandRepository.deleteById(id);

        return ResponseEntity.ok(Map.of(
                "message", "Commande supprimée avec succès"
        ));
    }
}