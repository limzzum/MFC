package com.ssafy.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomListDto {

    private Long roomId;
    private int totalTime;
    private int talkTime;
    private int maxPeople;
    private int curPeople;
    private int overtimeCount;
    public enum Status {
        ONGOING, DONE, WAITING
    }

    private Status status;
    private String aTopic;
    private String bTopic;
    private LocalDateTime startTime;
    private String aTopicUserUrl;
    private String bTopicUserUrl;
    private Long categoryId;
}
