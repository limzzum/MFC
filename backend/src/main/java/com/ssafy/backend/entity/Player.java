package com.ssafy.backend.entity;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Player {

    @Id
    @GeneratedValue
    private int id;

    @Column(name = "talkroom_id")
    @NotNull
    @ManyToOne
    @JoinColumn(name = "talkroom_id")
    private TalkRoom talkroom;

    @Column(name = "user_id")
    @NotNull
    @ManyToOne
    @JoinColumn(name = "user_id")
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
