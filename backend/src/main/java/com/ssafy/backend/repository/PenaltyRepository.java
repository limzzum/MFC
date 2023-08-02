package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Penalty;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PenaltyRepository extends JpaRepository<Penalty, Long> {

  @Query("select p from penalty_log p join fetch p.penaltyCode")
  List<Penalty> findAllPenalty();

}
