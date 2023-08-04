package com.ssafy.backend.entity;

import com.ssafy.backend.dto.request.*;
import java.util.Objects;
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
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Entity(name = "user")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
@Setter
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id", updatable = false)
  Long id;

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
  @JoinColumn(name = "item_code_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  ItemCode colorItem;


  public void updateInfo(UserUpdateDto userUpdateDto){
    if(userUpdateDto.getNickname()!=null){
      this.nickname = userUpdateDto.getNickname();
    }
    if(userUpdateDto.getPassword()!=null){
      this.password = userUpdateDto.getPassword();
    }
    if(userUpdateDto.getProfile()!=null){
      this.profile = userUpdateDto.getProfile();
    }
    if(userUpdateDto.getNameColor()!=null){
      this.colorItem = userUpdateDto.getNameColor();
    }
  }

  public void signout(){
    isDeleted = true;
  }
}



