package com.stage.mdm.repository;

import com.stage.mdm.model.DeviceProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeviceProfileRepository extends JpaRepository<DeviceProfile, Long> {

    Optional<DeviceProfile> findByDevice_Id(Long deviceId);

    List<DeviceProfile> findByProfile_Id(Long profileId);

    Optional<DeviceProfile> findFirstByDevice_IdAndActiveTrueOrderByAssignedAtDesc(Long deviceId);
}