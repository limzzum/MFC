package com.ssafy.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MethodResultDto {

  private boolean result = true;
  private String message;
  private Object data;

  public MethodResultDto(boolean result, String message) {
    this.result = result;
    this.message = message;
  }

  public MethodResultDto(boolean result, Object data) {
    this.result = result;
    this.data = data;
  }
}
