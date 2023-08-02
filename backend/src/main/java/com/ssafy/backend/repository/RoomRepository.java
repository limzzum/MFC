package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Room;
import com.ssafy.backend.entity.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Page<Room> findByIdLessThanAndStatusOrderByIdDesc(Long minRoomId, Status status, Pageable pageable);



}
