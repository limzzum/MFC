package com.ssafy.backend.dto.response;

import com.ssafy.backend.entity.Room;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomFinToPlayerDto {

    private String result;
    private int userVoteCount;
    private int voteTotal;
    private int userGetCoin;
    private int userGetExp;
    private int hp;

}
