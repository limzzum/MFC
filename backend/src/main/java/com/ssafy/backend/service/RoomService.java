package com.ssafy.backend.service;

import com.ssafy.backend.dto.response.RoomListDto;
import com.ssafy.backend.entity.Player;
import com.ssafy.backend.entity.Room;
import com.ssafy.backend.entity.Status;
import com.ssafy.backend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
@RequiredArgsConstructor
@Service
public class RoomService {

    private final RoomRepository roomRepository;

//    public Page<RoomListDto> ongoingRoomList(int page, int size) {
//        Pageable pageable = PageRequest.of(page,size, Sort.by("id").descending());
//        Page<Room> ongoingRooms = roomRepository.findByStatus(Status.ONGOING, pageable);
//
//        List<RoomListDto> rooms = ongoingRooms.stream()
//                .map(this::convertToRoomListDto)
//                .collect(Collectors.toList());
//    }
//
//    private RoomListDto convertToRoomListDto(Room room) {
//        // 여기서 각 토론방의 플레이어 정보를 가져와서 프로필 사진 URL 설정
//        // 플레이어 repository에서 a토픽, b토픽 유저의 url 가져오기...
//        Player playerA = room.;
//        Player playerB = room.getPlayerB();
//
//        // RoomListDto 객체 생성 후 프로필 사진 URL 설정
//        return RoomListDto.builder()
//                .talkRoomId(room.getId())
//                .totalTime(room.getTotalTime())
//                .talkTime(room.getTalkTime())
//                .maxPeople(room.getMaxPeople())
//                .curPeople(room.getCurPeople())
//                .overtimeCount(room.getOvertimeCount())
//                .status(room.getStatus())
//                .aTopic(room.getATopic())
//                .bTopic(room.getBTopic())
//                .startTime(room.getStartTime())
//                .aTopicUserUrl(playerA.getUser().getProfile()) // 플레이어 A의 프로필 사진 URL
//                .bTopicUserUrl(playerB.getUser().getProfile()) // 플레이어 B의 프로필 사진 URL
//                .categoryId(room.getCategory().getId())
//                .build();
//    }
}
