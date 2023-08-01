package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.print.Pageable;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

//    List<TalkRoom> findByStatus(Status status, Pageable pageable);


}
