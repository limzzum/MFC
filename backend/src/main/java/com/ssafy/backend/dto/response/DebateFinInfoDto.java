package com.ssafy.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DebateFinInfoDto {

  private String userProfile;
  private Long winner;
  private DebateFinPlayerDto playerA;
  private DebateFinPlayerDto playerB;
  private Boolean isSurrender;
  private Boolean isExit;

}
