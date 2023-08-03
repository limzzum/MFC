package com.ssafy.backend.service;

import com.ssafy.backend.dto.Message;
import com.ssafy.backend.entity.Participant;
import com.ssafy.backend.entity.Player;
import com.ssafy.backend.repository.ParticipantRepository;
import com.ssafy.backend.repository.PlayerRepository;
import java.util.List;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Transactional
@RequiredArgsConstructor
@Service
public class ParticipantService {

  private final ParticipantRepository participantRepository;
  private final PlayerRepository playerRepository;

//  public void resetParticipants(Long roomId) {
//    List<Participant> participants = participantRepository.findAllByRoomId(roomId);
//
//    if(!participants.isEmpty()) {
//      for(Participant p : participants) {
//        if(p.getRoleCode().getId() == 2) {
//          Player player = playerRepository.findAll
//        }
//
//
//        p.setIsVoteTypeA(null);
//        p.setVoteTime(null);
//      }
//      participantRepository.saveAll(participants);
//    }
//  }
}
