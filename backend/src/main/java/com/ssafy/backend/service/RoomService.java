package com.ssafy.backend.service;

import com.ssafy.backend.dto.response.RoomListDto;
import com.ssafy.backend.entity.Player;
import com.ssafy.backend.entity.Room;
import com.ssafy.backend.entity.Status;
import com.ssafy.backend.repository.PlayerRepository;
import com.ssafy.backend.repository.RoomRepository;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
@RequiredArgsConstructor
@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final PlayerRepository playerRepository;

    public List<RoomListDto> ongoingRoomList(Long minRoomId, int size) {
        Pageable pageable = PageRequest.of(0,size);
        Page<Room> ongoingRooms = roomRepository.findByIdLessThanAndStatusOrderByIdDesc(minRoomId,
            Status.ONGOING, pageable);

        List<RoomListDto> rooms = ongoingRooms.stream()
                .map(this::convertToRoomListDto)
                .collect(Collectors.toList());
        return rooms;
    }

    public List<RoomListDto> waitingRoomList(Long minRoomId, int size) {
        Pageable pageable = PageRequest.of(0,size);
        Page<Room> ongoingRooms = roomRepository.findByIdLessThanAndStatusOrderByIdDesc(minRoomId,
            Status.WAITING, pageable);

        List<RoomListDto> rooms = ongoingRooms.stream()
            .map(this::convertToRoomListDto)
            .collect(Collectors.toList());
        return rooms;
    }

    private RoomListDto convertToRoomListDto(Room room) {
        // 여기서 각 토론방의 플레이어 정보를 가져와서 프로필 사진 URL 설정
        // 플레이어 repository에서 a토픽, b토픽 유저의 url 가져오기...

        Player playerA = playerRepository.findFirstByRoomIdAndIsTopicTypeATrue(room.getId()).orElse(null);
        Player playerB = playerRepository.findFirstByRoomIdAndIsTopicTypeAFalse(room.getId()).orElse(null);

        String aTopicUserUrladdress = null;
        String bTopicUserUrladdress = null;

        RoomListDto.Status roomStatus;
        if (room.getStatus() == Status.ONGOING) {
            roomStatus = RoomListDto.Status.ONGOING;
        } else if (room.getStatus() == Status.DONE) {
            roomStatus = RoomListDto.Status.DONE;
        } else {
            roomStatus = RoomListDto.Status.WAITING;
        }

        if(playerA != null && playerA.getUser() != null && playerA.getUser().getProfile() != null) {
            aTopicUserUrladdress = playerA.getUser().getProfile();
        }

        if(playerB != null && playerB.getUser() != null && playerB.getUser().getProfile() != null) {
            bTopicUserUrladdress = playerB.getUser().getProfile();
        }

        // RoomListDto 객체 생성 후 프로필 사진 URL 설정
        return RoomListDto.builder()
                .roomId(room.getId())
                .totalTime(room.getTotalTime())
                .talkTime(room.getTalkTime())
                .maxPeople(room.getMaxPeople())
                .curPeople(room.getCurPeople())
                .overtimeCount(room.getOvertimeCount())
                .status(roomStatus)
                .aTopic(room.getATopic())
                .bTopic(room.getBTopic())
                .startTime(room.getStartTime())
                .aTopicUserUrl(aTopicUserUrladdress) // 플레이어 A의 프로필 사진 URL
                .bTopicUserUrl(bTopicUserUrladdress) // 플레이어 B의 프로필 사진 URL
                .categoryId(room.getCategoryCode().getId())
                .build();
    }


}
