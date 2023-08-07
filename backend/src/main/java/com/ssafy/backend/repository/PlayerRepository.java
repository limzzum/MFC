package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Player;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface PlayerRepository extends JpaRepository<Player, Long> {

  Optional<Player> findFirstByRoomIdAndIsTopicTypeA(Long roomId, Boolean isTopicTypeA);

  List<Player> findAllByRoomId(Long roomId);

  Optional<Player> findTopByRoomIdAndUserId(Long roomId, Long userId);

  @Modifying
  @Transactional
  @Query("UPDATE Player SET user.id = null WHERE room.id = :roomId and user.id = :userId")
  void resetUserId(Long roomId, Long userId);
}
