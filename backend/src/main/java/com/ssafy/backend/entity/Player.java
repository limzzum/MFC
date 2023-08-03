package com.ssafy.backend.entity;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
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

}
