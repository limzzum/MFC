package com.ssafy.backend.controller;

import com.ssafy.backend.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor
@RequestMapping("/api/item")
public class ItemController {

  private final ItemService itemService;
  @GetMapping("/list")
  public ResponseEntity<?> itemcodelist() {
    //try { 회원하면 예외처리하기
    return ResponseEntity.ok(itemService.findAll());
    //} catch ()
  }

}
