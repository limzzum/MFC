package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ItemCode;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemCodeRepository extends JpaRepository<ItemCode, Long> {

  Optional<ItemCode> findItemCodeByNameContaining(String itemName);
}
