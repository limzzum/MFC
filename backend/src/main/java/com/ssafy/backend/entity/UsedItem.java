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
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "used_item")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
@Builder
public class UsedItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "used_item_id", updatable = false)
  private Long id;

  @CreationTimestamp
  @Column(name = "used_time")
  private LocalDateTime usedTime;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "item_code_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  private ItemCode itemcode;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "player_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  private Player player;
}
