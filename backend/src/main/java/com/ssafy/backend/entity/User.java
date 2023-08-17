package com.ssafy.backend.entity;

import com.ssafy.backend.dto.request.*;

import javax.persistence.*;
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

//  @OneToOne
//  @JoinColumn(name = "file_id")
//  UploadFile profile;
  String profile;

  @Column(name = "is_deleted")
  @ColumnDefault("false")
  boolean isDeleted;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "item_code_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  ItemCode colorItem;


  public void updateInfo(UserUpdateDto userUpdateDto, ItemCode itemCode){
    if(userUpdateDto.getNickname()!=null){
      this.nickname = userUpdateDto.getNickname();
    }
    if(userUpdateDto.getPassword()!=null){
      this.password = userUpdateDto.getPassword();
    }
    if(userUpdateDto.getProfile()!=null){
//      this.profile = userUpdateDto.getProfile();
    }
    if(userUpdateDto.getNameColorId()!=null){
      this.colorItem = itemCode;
    }
  }

  public void signout(){
    isDeleted = true;
  }

  public User(Long userId){
    this.id = userId;
  }
}



