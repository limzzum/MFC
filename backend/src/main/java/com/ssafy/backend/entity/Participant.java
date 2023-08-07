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
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "participant")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Participant {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "participant_id", updatable = false)
  private Long id;

  @Column(name = "nick_name", nullable = false, length = 24)
  private String nickName;

  @Column(name = "is_vote_type_a")
  private Boolean isVoteTypeA;

  @Column(name = "is_host", columnDefinition = "BOOLEAN default false")
  private boolean isHost;

  @Column(name = "vote_time")
  private LocalDateTime voteTime;

  @CreationTimestamp
  @Column(name = "enter_time")
  private LocalDateTime enterTime;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "talkroom_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  private Room room;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "role_code_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  private RoleCode roleCode;

  public void changeRole(RoleCode roleCode){
    this.roleCode = roleCode;
  }
}
