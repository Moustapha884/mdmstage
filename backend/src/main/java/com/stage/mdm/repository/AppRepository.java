package com.stage.mdm.repository;

import com.stage.mdm.model.App;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppRepository extends JpaRepository<App, Long> {
}