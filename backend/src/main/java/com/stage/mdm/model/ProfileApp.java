package com.stage.mdm.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ProfileApp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean required;

    private LocalDateTime addedAt;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    private MdmProfile profile;

    @ManyToOne
    @JoinColumn(name = "app_id")
    private App app;

    public ProfileApp() {
        this.addedAt = LocalDateTime.now();
        this.required = true;
    }

    public Long getId() {
        return id;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }

    public MdmProfile getProfile() {
        return profile;
    }

    public void setProfile(MdmProfile profile) {
        this.profile = profile;
    }

    public App getApp() {
        return app;
    }

    public void setApp(App app) {
        this.app = app;
    }
}