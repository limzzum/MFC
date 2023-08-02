package com.ssafy.backend.repository;

import com.ssafy.backend.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoryRepository extends JpaRepository<History, Long> {

}
