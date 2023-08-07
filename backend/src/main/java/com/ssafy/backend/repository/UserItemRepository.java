package com.ssafy.backend.repository;

import com.ssafy.backend.entity.UserItem;
import io.lettuce.core.dynamic.annotation.Param;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserItemRepository extends JpaRepository<UserItem, Long> {
    @Query("select u from UserItem u join fetch u.itemCode WHERE u.user.id =:userId")
    List<UserItem> findAllUserItem(Long userId);
    UserItem findByUserIdAndItemCodeId(Long userId,Long itemCodeId);


}
