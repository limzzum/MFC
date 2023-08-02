package com.ssafy.backend.service;

import com.ssafy.backend.dto.request.HistoryReqDto;
import com.ssafy.backend.dto.response.HistoryResDto;
import com.ssafy.backend.dto.response.PenaltyDto;
import com.ssafy.backend.entity.History;
import com.ssafy.backend.entity.Penalty;
import com.ssafy.backend.repository.HistoryRepository;
import com.ssafy.backend.repository.PenaltyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoryService {

  private final HistoryRepository historyRepository;

  public History save(History history) {
    historyRepository.save(history);
    return history;
  }

  public void change(HistoryReqDto historyReqDto){
    History orgHistory = historyRepository.findHistoryByUserId(historyReqDto.getUserId());
    if (orgHistory != null) {
      orgHistory.setCoin(orgHistory.getCoin()+ historyReqDto.getCoin());
      orgHistory.setExperience(orgHistory.getExperience()+ historyReqDto.getExp());
      historyRepository.save(orgHistory);
    }
  }

  /*
  * 승리 카운트 메서드
  * */
  public void incrementWinCount(Long userId){
    History history = historyRepository.findHistoryByUserId(userId);
    if (history != null) {
      history.setWinCount(history.getWinCount() + 1);
      historyRepository.save(history);
    }
  }

  /*
   * 패배 카운트 메서드
   * */
  public void incrementLoseCount(Long userId){
    History history = historyRepository.findHistoryByUserId(userId);
    if (history != null) {
      history.setLoseCount(history.getLoseCount() + 1);
      historyRepository.save(history);
    }
  }

  /*
   * 무승부 카운트 메서드
   * */
  public void incrementDrawCount(Long userId){
    History history = historyRepository.findHistoryByUserId(userId);
    if (history != null) {
      history.setDrawCount(history.getDrawCount() + 1);
      historyRepository.save(history);
    }
  }


  /*
   * 유저 전적 조회 메서드
   * */
  public HistoryResDto findById(Long userId) {
    if(historyRepository.findHistoryByUserId(userId) == null) {
      return null;
    }
    else {
      History history = historyRepository.findHistoryByUserId(userId);
      HistoryResDto historyResDto = HistoryResDto.builder()
              .userId(history.getUser().getId())
              .nickName(history.getUser().getNickname())
              .coin(history.getCoin())
              .exp(history.getExperience())
              .winCount(history.getWinCount())
              .loseCount(history.getLoseCount())
              .drawCount(history.getDrawCount())
              .winRate(calculateWinRate(history.getWinCount(), history.getLoseCount()))
              .build();
      return historyResDto;
    }
  }

  public Boolean existByUserId(Long userId){
    if(historyRepository.findHistoryByUserId(userId) != null) {
      return true;
    }
    return false;
  }

  /*
   * 승률 계산
   * */
  private double calculateWinRate(int winCount, int loseCount){
    if(winCount == 0 && loseCount == 0)
      return 0;
    else
      return ((double)winCount/ (winCount + loseCount)) * 100.0;
  }

//  public Page<HistoryResDto> getAllHistory(Pageable pageable){
//    Page<History> histories = historyRepository.findAllByOrderByRankAtAsc(pageable);
//    List<HistoryResDto> historyResDtoList = histories.stream()
//            .map(history-> {
//              return HistoryResDto.of(history);
//            }).collect(Collectors.toList());
//    return new PageImpl<>(historyResDtoList, pageable, histories.getTotalElements());
//  }

}
