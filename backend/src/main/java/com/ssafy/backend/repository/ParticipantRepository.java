package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Participant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {

  List<Participant> findAllByRoomId(Long roomId);

  List<Participant> findAllByRoleCodeId(Long roleCodeId);

  Participant findAllByUserIdAndRoomId(Long userId, Long roomId);

  Long countByIsVoteTypeAAndRoomIdAndRoleCodeIdNot(Boolean result, Long roomId, Long roleCodeId);

  Participant findTop1ByRoomIdAndRoleCodeIdNotAndIsHostOrderByEnterTimeAsc(Long roomId,
      Long roleCodeId,
      Boolean isHost);

  List<Participant> findAllByRoomIdAndRoleCodeIdNot(Long roomId, Long RoleCode);
}
