package com.stage.mdm.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class App {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String packageName;
    private String version;

    /*
     * apkUrl garde le lien de téléchargement généré par le backend.
     * Exemple : http://localhost:8080/api/apps/1/apk
     */
    @Column(length = 1000)
    private String apkUrl;

    /*
     * apkFileName = nom technique du fichier stocké dans uploads/apks
     * apkOriginalName = nom original choisi par l'administrateur
     */
    private String apkFileName;
    private String apkOriginalName;
    private String apkContentType;
    private Long apkSize;

    private String type;
    private String status;
    private LocalDateTime createdAt;

    public App() {
        this.createdAt = LocalDateTime.now();
        this.status = "ACTIVE";
        this.type = "REQUIRED";
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getApkUrl() {
        return apkUrl;
    }

    public void setApkUrl(String apkUrl) {
        this.apkUrl = apkUrl;
    }

    public String getApkFileName() {
        return apkFileName;
    }

    public void setApkFileName(String apkFileName) {
        this.apkFileName = apkFileName;
    }

    public String getApkOriginalName() {
        return apkOriginalName;
    }

    public void setApkOriginalName(String apkOriginalName) {
        this.apkOriginalName = apkOriginalName;
    }

    public String getApkContentType() {
        return apkContentType;
    }

    public void setApkContentType(String apkContentType) {
        this.apkContentType = apkContentType;
    }

    public Long getApkSize() {
        return apkSize;
    }

    public void setApkSize(Long apkSize) {
        this.apkSize = apkSize;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}