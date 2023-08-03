package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Participant;
import com.ssafy.backend.entity.Player;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {

  List<Participant> findAllByRoomId(Long roomId);

  List<Participant> findAllByRoleCodeId(Long roleCodeId);

  Participant findAllByUserIdAndRoomId(Long userId, Long roomId);

}
