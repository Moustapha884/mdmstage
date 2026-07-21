package com.stage.mdm.repository;

import com.stage.mdm.model.MdmProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MdmProfileRepository extends JpaRepository<MdmProfile, Long> {
}