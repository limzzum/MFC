package com.ssafy.backend.dto.response;


import java.util.List;
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
public class ParticipantsDto {

  private List<ViewerDto> viewers;
  private List<PlayerResDto> players;

}
