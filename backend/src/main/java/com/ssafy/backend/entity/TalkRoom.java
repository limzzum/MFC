package com.ssafy.backend.entity;

import java.time.LocalDateTime;
import javax.persistence.*;

import lombok.*;

@Entity
@Table(name = "talkroom")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
@Builder
public class TalkRoom {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "talkroom_id", updatable = false)
  private Long id;

  @Column(name = "total_time", nullable = false)
  private int totalTime;

  @Column(name = "talk_time", nullable = false)
  private int talkTime;

  @Column(name = "max_people", nullable = false)
  private int maxPeople;

  @Column(name = "cur_people", nullable = false, columnDefinition = "INT default 0") // 기본값 0
  private int curPeople;

  @Column(name = "overtime_count", nullable = false)
  private int overtimeCount;

  @Enumerated(EnumType.STRING)
  private Status status;

  @Column(name = "a_topic", nullable = false, length = 20)
  private String aTopic;

  @Column(name = "b_topic", nullable = false, length = 20)
  private String bTopic;

  @Column(name = "start_time")
  private LocalDateTime startTime;

  @ManyToOne(fetch = FetchType.LAZY )
  @JoinColumn(name = "category_id")
  private Category category;

}