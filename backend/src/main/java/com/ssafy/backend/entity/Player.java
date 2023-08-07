package com.ssafy.backend.entity;

import com.ssafy.backend.dto.request.*;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.Objects;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Player {


  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "player_id", updatable = false)
  private Long id;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "talkroom_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  private Room room;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  private User user;

  @Column(name = "remain_overtime_count")
  @NotNull
  private int remainOverTimeCount;

  @Column(name = "heart_point")
  @ColumnDefault("100")
  private int heartPoint;

  @Column(name = "is_ready")
  @ColumnDefault("false")
  private boolean isReady;

  @Column(name = "is_topic_type_a")
  @ColumnDefault("false")
  private boolean isTopicTypeA;

  public void changeStatus(boolean status){
    this.isReady = status;
  }
  public void updateInfo(PlayerUpdateDto playerUpdateDto){
    this.heartPoint = playerUpdateDto.getHeartPoint();
  }
  public boolean removeOverTimeCnt(){
    if(this.remainOverTimeCount == 0){
      return false;
    }
    this.remainOverTimeCount -= 1;
    return true;
  }


}
