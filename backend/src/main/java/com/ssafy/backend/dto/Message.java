package com.ssafy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

/*
 * Message message = new Message();
 * message.setStatus(HttpStatus.OK);
 * message.setMessage("message");
 * message.setData(reqBody);
 * return ResponseEntity.ok(message);
 *
 * Message message = new Message(HttpStatus.OK, "message", reqBody);
 * return ResponseEntity.ok(message);
 * */
@Data
@AllArgsConstructor
public class Message {

  private HttpStatus status;
  private String message;
  private Object data;

  public Message() {
    this.status = HttpStatus.BAD_REQUEST;
    this.data = null;
    this.message = null;
  }
}


