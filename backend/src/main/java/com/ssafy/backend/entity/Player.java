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
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Player {


  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @ManyToOne
  @JoinColumn(name = "talkroom_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  private Room room;

  @NotNull
  @ManyToOne
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
