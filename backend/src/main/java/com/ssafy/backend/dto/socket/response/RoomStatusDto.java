package com.ssafy.backend.dto.socket.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoomStatusDto {
    private Long curUserId;
    @JsonProperty("isATurn")
    private boolean isATurn;
    private LocalDateTime startTalkTime;
    private int hpPointA;
    private int hpPointB;
    private String roomImagePath;
}
