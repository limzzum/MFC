package com.ssafy.backend.dto.response;

import com.ssafy.backend.entity.Penalty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PenaltyDto {
    private Long id;
    private LocalDateTime penaltyTime;
    private Long penaltyCode;
    private String penaltyName;
    private int points;
    private Long userId;
    private String userName;

    public static PenaltyDto of(Penalty penalty){
        return new PenaltyDto(penalty.getId(),
                penalty.getPenaltyTime(),
                penalty.getPenaltyCode().getId(),
                penalty.getPenaltyCode().getName(),
                penalty.getPenaltyCode().getPoints(),
                penalty.getUser().getId(),
                penalty.getUser().getNickname()
        );
    }
}
