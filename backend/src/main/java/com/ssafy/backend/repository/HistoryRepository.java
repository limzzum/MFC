package com.ssafy.backend.repository;

import com.ssafy.backend.entity.History;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface HistoryRepository extends JpaRepository<History, Long> {

    @Query("select h from history h join fetch h.user WHERE h.user.id =:userId")
    History findHistoryByUserId(Long userId);

//    Page<History> findAllByOrderByRankAtAsc(Pageable pageable);
}
