package com.ssafy.backend.repository;

import com.ssafy.backend.entity.UsedItem;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsedItemRepository extends JpaRepository<UsedItem, Long> {

  Optional<UsedItem> findTopByPlayerIdAndItemcodeId(Long playerId,Long itemCodeId);

}
