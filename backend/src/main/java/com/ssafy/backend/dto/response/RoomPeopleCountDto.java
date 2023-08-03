package com.ssafy.backend.dto.response;


import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomPeopleCountDto {
    private int validCount;
    private int currentCount;
//    private int viewer;
//    private int player;
}
