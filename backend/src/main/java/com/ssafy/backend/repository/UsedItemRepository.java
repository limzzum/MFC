package com.ssafy.backend.repository;

import com.ssafy.backend.entity.UsedItem;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsedItemRepository extends JpaRepository<UsedItem, Long> {

  Optional<UsedItem> findTopByPlayerIdAndItemcodeIdAndUsedTimeGreaterThan(Long playerId, Long itemId, LocalDateTime startTime);

}
