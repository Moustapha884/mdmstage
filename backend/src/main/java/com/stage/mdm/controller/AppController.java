package com.stage.mdm.controller;

import com.stage.mdm.model.App;
import com.stage.mdm.model.ProfileApp;
import com.stage.mdm.repository.AppRepository;
import com.stage.mdm.repository.ProfileAppRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/apps")
@CrossOrigin(origins = "http://localhost:4200")
public class AppController {

    private static final String APK_MEDIA_TYPE = "application/vnd.android.package-archive";

    private final AppRepository appRepository;
    private final ProfileAppRepository profileAppRepository;

    private final Path uploadDirectory = Paths
            .get("uploads", "apks")
            .toAbsolutePath()
            .normalize();

    public AppController(
            AppRepository appRepository,
            ProfileAppRepository profileAppRepository
    ) {
        this.appRepository = appRepository;
        this.profileAppRepository = profileAppRepository;

        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException exception) {
            throw new RuntimeException("Impossible de créer le dossier uploads/apks", exception);
        }
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createApp(
            @RequestParam("name") String name,
            @RequestParam("packageName") String packageName,
            @RequestParam("version") String version,
            @RequestParam("type") String type,
            @RequestParam("status") String status,
            @RequestParam("apkFile") MultipartFile apkFile
    ) {
        if (apkFile == null || apkFile.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Le fichier APK est obligatoire"
            ));
        }

        if (!isApkFile(apkFile)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Le fichier doit être au format .apk"
            ));
        }

        try {
            App app = new App();

            app.setName(name);
            app.setPackageName(packageName);
            app.setVersion(version);
            app.setType(isBlank(type) ? "REQUIRED" : type);
            app.setStatus(isBlank(status) ? "ACTIVE" : status);
            app.setCreatedAt(LocalDateTime.now());

            StoredApkData storedApkData = storeApkFile(apkFile);
            fillApkData(app, storedApkData);

            App savedApp = appRepository.save(app);

            savedApp.setApkUrl(buildDownloadUrl(savedApp.getId()));
            savedApp = appRepository.save(savedApp);

            return ResponseEntity.ok(savedApp);

        } catch (IOException exception) {
            return ResponseEntity.status(500).body(Map.of(
                    "message", "Erreur lors de l'enregistrement du fichier APK"
            ));
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateApp(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("packageName") String packageName,
            @RequestParam("version") String version,
            @RequestParam("type") String type,
            @RequestParam("status") String status,
            @RequestParam(value = "apkFile", required = false) MultipartFile apkFile
    ) {
        Optional<App> appOptional = appRepository.findById(id);

        if (appOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Application introuvable"
            ));
        }

        try {
            App app = appOptional.get();

            app.setName(name);
            app.setPackageName(packageName);
            app.setVersion(version);
            app.setType(isBlank(type) ? "REQUIRED" : type);
            app.setStatus(isBlank(status) ? "ACTIVE" : status);

            if (apkFile != null && !apkFile.isEmpty()) {
                if (!isApkFile(apkFile)) {
                    return ResponseEntity.badRequest().body(Map.of(
                            "message", "Le fichier doit être au format .apk"
                    ));
                }

                deleteApkFile(app.getApkFileName());

                StoredApkData storedApkData = storeApkFile(apkFile);
                fillApkData(app, storedApkData);
            }

            app.setApkUrl(buildDownloadUrl(app.getId()));

            App updatedApp = appRepository.save(app);

            return ResponseEntity.ok(updatedApp);

        } catch (IOException exception) {
            return ResponseEntity.status(500).body(Map.of(
                    "message", "Erreur lors de la modification du fichier APK"
            ));
        }
    }

    @GetMapping("/{id}/apk")
    public ResponseEntity<Resource> downloadApk(@PathVariable Long id) {
        Optional<App> appOptional = appRepository.findById(id);

        if (appOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        App app = appOptional.get();

        if (isBlank(app.getApkFileName())) {
            return ResponseEntity.notFound().build();
        }

        try {
            Path apkPath = uploadDirectory
                    .resolve(app.getApkFileName())
                    .normalize();

            if (!apkPath.startsWith(uploadDirectory) || !Files.exists(apkPath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(apkPath.toUri());

            String downloadName = !isBlank(app.getApkOriginalName())
                    ? app.getApkOriginalName()
                    : "application.apk";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(APK_MEDIA_TYPE))
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            ContentDisposition
                                    .attachment()
                                    .filename(downloadName)
                                    .build()
                                    .toString()
                    )
                    .body(resource);

        } catch (MalformedURLException exception) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApp(@PathVariable Long id) {
        Optional<App> appOptional = appRepository.findById(id);

        if (appOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "Application introuvable"
            ));
        }

        App app = appOptional.get();

        List<ProfileApp> linkedProfileApps = profileAppRepository.findByApp_Id(id);
        profileAppRepository.deleteAll(linkedProfileApps);

        deleteApkFile(app.getApkFileName());

        appRepository.deleteById(id);

        return ResponseEntity.ok(Map.of(
                "message", "Application supprimée avec succès"
        ));
    }

    private boolean isApkFile(MultipartFile file) {
        String originalName = file.getOriginalFilename();

        if (originalName == null) {
            return false;
        }

        return originalName.toLowerCase().endsWith(".apk");
    }

    private StoredApkData storeApkFile(MultipartFile apkFile) throws IOException {
        String originalName = apkFile.getOriginalFilename();

        if (originalName == null || originalName.isBlank()) {
            originalName = "application.apk";
        }

        String safeOriginalName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String storedFileName = UUID.randomUUID() + "_" + safeOriginalName;

        Path targetPath = uploadDirectory
                .resolve(storedFileName)
                .normalize();

        if (!targetPath.startsWith(uploadDirectory)) {
            throw new IOException("Chemin APK invalide");
        }

        try (InputStream inputStream = apkFile.getInputStream()) {
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }

        return new StoredApkData(
                storedFileName,
                originalName,
                apkFile.getContentType(),
                apkFile.getSize()
        );
    }

    private void fillApkData(App app, StoredApkData storedApkData) {
        app.setApkFileName(storedApkData.fileName());
        app.setApkOriginalName(storedApkData.originalName());
        app.setApkContentType(
                !isBlank(storedApkData.contentType())
                        ? storedApkData.contentType()
                        : APK_MEDIA_TYPE
        );
        app.setApkSize(storedApkData.size());
    }

    private void deleteApkFile(String fileName) {
        if (isBlank(fileName)) {
            return;
        }

        try {
            Path filePath = uploadDirectory
                    .resolve(fileName)
                    .normalize();

            if (filePath.startsWith(uploadDirectory)) {
                Files.deleteIfExists(filePath);
            }

        } catch (IOException ignored) {
            // On ignore pour ne pas bloquer la suppression de l'application.
        }
    }

    private String buildDownloadUrl(Long appId) {
        return "http://localhost:8080/api/apps/" + appId + "/apk";
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private record StoredApkData(
            String fileName,
            String originalName,
            String contentType,
            Long size
    ) {}
}