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
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "participant")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class Participant {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "participant_id", updatable = false)
  private Long id;

  @Column(name = "nick_name", nullable = false, length = 24)
  private String nickName;

  @Column(name = "is_vote_type_a")
  private Boolean isVoteTypeA;

  @Column(name = "is_host", nullable = false, columnDefinition = "BOOLEAN default false")
  private boolean isHost;

  @Column(name = "vote_time")
  private LocalDateTime voteTime;

  @Column(name = "enter_time", nullable = false)
  private LocalDateTime enterTime;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  private User users;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "room_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  private Room room;

  @OneToOne
  @JoinColumn(name = "role_code_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  private RoleCode roleCode;

}
