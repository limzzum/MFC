package com.ssafy.backend.entity;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.ConstraintMode;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "penalty_log")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Penalty {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "penalty_log_id", updatable = false)
  private Long id;

  @Column(name = "penalty_time", nullable = false)
  private LocalDateTime penaltyTime;

  @ManyToOne(targetEntity = PenaltyCode.class, fetch = FetchType.LAZY)
  @JoinColumn(name = "penalty_code_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  private PenaltyCode penaltyCode;

  @ManyToOne(targetEntity = User.class, fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  private User user;

//  @Column(name = "user_id")
//  private Long userId;
//
//  @Column(name = "penalty_code_id")
//  private Long penaltyCodeId;
//
//  @Column(name = "room_id")
//  private Long roomId;
}
