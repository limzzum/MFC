package com.ssafy.backend.service;

import com.ssafy.backend.entity.Penalty;
import com.ssafy.backend.repository.PenaltyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PenaltyService {

  private final PenaltyRepository penaltyRepository;

  public Penalty save(Penalty penalty) {
    penaltyRepository.save(penalty);
    return penalty;
  }

}
