package com.ssafy.backend.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class voteResultDto {
    private Long totalCountA;
    private Long totalCountB;
}
