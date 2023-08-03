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
public class getHistoryDto {

  private int totalPageCount;
  private List<HistoryResDto> result;

}
