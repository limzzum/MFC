package com.ssafy.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class ResponseDto<T> {
    private T data;
}
