package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    List<Participant> findAllByRoomId(Long roomId);
    List<Participant> findAllByRoleCodeId(Long roleCodeId);
}
