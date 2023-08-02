package com.ssafy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/*
 * Message message = new Message();
 * message.setStatus(StatusEnum.CREATED);
 * message.setMessage("성공 코드");
 * message.setData(reqBody);
 * return ResponseEntity.ok(message);
 * */
@Data
@AllArgsConstructor
public class Message {

  private StatusEnum status;
  private String message;
  private Object data;

  public Message() {
    this.status = StatusEnum.BAD_REQUEST;
    this.data = null;
    this.message = null;
  }

  public enum StatusEnum {

    OK(200, "OK"),
    CREATED(201, "CREATED"),
    BAD_REQUEST(400, "BAD_REQUEST"),
    NOT_FOUND(404, "NOT_FOUND"),
    INTERNAL_SERER_ERROR(500, "INTERNAL_SERVER_ERROR");

    int statusCode;
    String code;

    StatusEnum(int statusCode, String code) {
      this.statusCode = statusCode;
      this.code = code;
    }
  }


}


