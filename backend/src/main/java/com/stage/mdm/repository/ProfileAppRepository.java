package com.stage.mdm.repository;

import com.stage.mdm.model.ProfileApp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfileAppRepository extends JpaRepository<ProfileApp, Long> {

    List<ProfileApp> findByProfile_Id(Long profileId);

    List<ProfileApp> findByApp_Id(Long appId);
}