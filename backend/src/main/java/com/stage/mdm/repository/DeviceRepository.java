package com.stage.mdm.repository;

import com.stage.mdm.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeviceRepository extends JpaRepository<Device, Long> {

    Optional<Device> findByImei(String imei);

    Optional<Device> findByDeviceIdentifier(String deviceIdentifier);
}