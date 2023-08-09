package com.ssafy.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantOutDto {

    private Boolean isHostChange = false;
    private Boolean isRoomChange = false;
    private Long userId;

}
