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
public class DebateFinPlayerDto {

  private int vote;
  private int hp;
  private int coin;
  private int getCoin;
  private int exp;
  private int getExp;



}
