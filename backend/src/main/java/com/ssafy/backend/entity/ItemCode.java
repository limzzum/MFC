package com.ssafy.backend.entity;

import java.util.Objects;
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
@Table(name = "item_code")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class ItemCode {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "item_code_id", updatable = false)
  private Long id;

  @Column(nullable = false, length = 10)
  private String name;

  @Column(name="icon_name")
  private String iconName;

  @Column(nullable = false, length = 100)
  private String comment;

  @Column(nullable = false)
  private int price;

  @Column(length = 10)
  private String rgb;

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ItemCode itemCode = (ItemCode) o;
    return Objects.equals(id, itemCode.getId());
  }
}
