package com.ssafy.backend.entity;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.*;

@Entity(name = "user")
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class User {

    @Id
    @GeneratedValue
    int id;

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
    @JoinColumn(name = "item_code_id")
    ItemCode colorItem;
}



