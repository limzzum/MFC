package com.ssafy.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomFinToParticipantDto {

    private String aTopic;
    private String bTopic;
    private String aResult;
    private String bResult;
    private int aVoteCount;
    private int bVoteCount;
    private int aHp;
    private int bHp;

}
