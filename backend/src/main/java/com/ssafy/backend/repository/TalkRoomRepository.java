package com.ssafy.backend.repository;

import com.ssafy.backend.entity.TalkRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.print.Pageable;
import java.util.List;

public interface TalkRoomRepository extends JpaRepository<TalkRoom, Long> {

    List<TalkRoom> findByStatus(Status status, Pageable pageable);


}
