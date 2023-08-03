package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Room;
import com.ssafy.backend.entity.Status;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Page<Room> findByIdLessThanAndStatusOrderByIdDesc(Long minRoomId, Status status, Pageable pageable);
    @Query("SELECT DISTINCT r FROM Room r " +
            "WHERE ((r.aTopic LIKE %:keyword% OR r.bTopic LIKE %:keyword%) " +
            "OR r.id IN (SELECT p.room.id FROM Participant p WHERE p.nickName LIKE %:keyword% AND p.roleCode.id = 2)) " +
            "AND r.id < :minRoomId " +
            "ORDER BY r.id DESC")
    List<Room> searchRoomsByKeyword(@Param("keyword") String keyword, @Param("minRoomId") Long minRoomId, Pageable pageable);


}
