package com.ssafy.backend.dto.response;

import com.ssafy.backend.entity.Room;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomInfoResponseDto {
    private Long id;
    private int totalTime;
    private int talkTime;
    private int maxPeople;
    private int curPeople;
    private int overTimeCount;
    public enum Status {
        ONGOING, DONE, WAITING
    }
    private Status status;
    private String aTopic;
    private String bTopic;
    private Long categoryCodeId;
    private LocalDateTime startTime;

    public RoomInfoResponseDto(Room room) {
        this.id = room.getId();
        this.totalTime = room.getTotalTime();
        this.talkTime = room.getTalkTime();
        this.maxPeople = room.getMaxPeople();
        this.curPeople = room.getCurPeople();
        this.overTimeCount = room.getOverTimeCount();
        this.status = Status.valueOf(room.getStatus().name());
        this.aTopic = room.getATopic();
        this.bTopic = room.getBTopic();
        this.categoryCodeId = room.getCategoryCode().getId();
        this.startTime = room.getStartTime();
    }
}
