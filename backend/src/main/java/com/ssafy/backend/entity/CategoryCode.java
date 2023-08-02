package com.ssafy.backend.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "category")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class CategoryCode {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "category_id", updatable = false)
  private Long id;

  @Column(nullable = false, length = 10)
  private int name;

}
