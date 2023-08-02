package com.ssafy.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomInfoRuquestDto {

  private int totalTime;
  private int talkTime;
  private int maxPeople;
  private int overTimeCount;
  @JsonProperty("atopic")
  private String aTopic;
  @JsonProperty("btopic")
  private String bTopic;


}
