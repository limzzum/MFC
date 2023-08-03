package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Player;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player, Long> {

  Optional<Player> findFirstByRoomIdAndIsTopicTypeA(Long roomId,Boolean isTopicTypeA);

  List<Player> findAllByRoomId(Long roomId);

  Optional<Player> findTopByRoomIdAndUserId(Long roomId, Long userId);

}
