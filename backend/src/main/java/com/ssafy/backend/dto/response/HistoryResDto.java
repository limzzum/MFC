package com.ssafy.backend.dto.response;


import com.ssafy.backend.entity.History;
import com.ssafy.backend.entity.Penalty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HistoryResDto {

    private Long userId;
    private String nickName;
    private String profile;
    private int coin;
    private int exp;
    private int winCount;
    private int loseCount;
    private int drawCount;
    private double winRate;


    HistoryResDto(Long userId, String nickName, String profile, int winCount, int loseCount, int drawCount){
        this.userId = userId;
        this.nickName = nickName;
        this.profile = profile;
        this.winCount = winCount;
        this.loseCount = loseCount;
        this.drawCount = drawCount;
        this.winRate = ((double)winCount/(winCount + loseCount)) * 100.0;

    }
//    public static HistoryResDto of(History history){
//        return new HistoryResDto(history.getUser().getId(),
//                history.getUser().getNickname(),
//                history.getUser().getProfile(),
//                history.getWinCount(),
//                history.getLoseCount(),
//                history.getDrawCount()
//        );
//    }

}
