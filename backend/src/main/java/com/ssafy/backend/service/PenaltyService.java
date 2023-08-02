package com.ssafy.backend.service;

import com.ssafy.backend.dto.response.PenaltyDto;
import com.ssafy.backend.dto.response.UserItemListDto;
import com.ssafy.backend.entity.Penalty;
import com.ssafy.backend.entity.UserItem;
import com.ssafy.backend.repository.PenaltyRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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

  public List<PenaltyDto> findAllPenalty(Long userId) {
    List<Penalty> penalties = penaltyRepository.findAllPenalty(userId);
    if(penalties.isEmpty()) {
      return Collections.emptyList();
    }

    List<PenaltyDto> penaltyDtoList = penalties.stream()
            .map(penalty-> {
              return PenaltyDto.of(penalty);
            }).collect(Collectors.toList());

    return penaltyDtoList;
  }

}
