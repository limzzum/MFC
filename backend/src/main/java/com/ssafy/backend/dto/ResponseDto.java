package com.ssafy.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class ResponseDto<T,HttpStatus> {
    private T data;
    private HttpStatus status;
}
