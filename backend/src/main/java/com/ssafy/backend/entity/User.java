package com.ssafy.backend.entity;

import javax.persistence.Column;
import javax.persistence.ConstraintMode;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

@Entity(name = "user")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id", updatable = false)
  Long id;

  @NotNull
  String email;

  @Column(name = "nick_name")
  @NotNull
  String nickname;

  @NotNull
  String password;

  String profile;

  @Column(name = "is_deleted")
  @ColumnDefault("false")
  boolean isDeleted;

  @ManyToOne
  @JoinColumn(name = "item_code_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  ItemCode colorItem;
}



