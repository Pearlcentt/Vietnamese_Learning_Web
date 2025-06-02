package group3.vietnamese_learning_web.repository;

import group3.vietnamese_learning_web.model.UserFriend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFriendRepository extends JpaRepository<UserFriend, Integer> {
    
    // Find friends for a specific user
    Optional<UserFriend> findByUserId(Integer userId);
    
    // Check if a friendship record exists for a user
    boolean existsByUserId(Integer userId);
    
    // Delete friendship record for a user
    void deleteByUserId(Integer userId);
    
    // Custom query to get all user IDs who have a specific friend
    @Query("SELECT uf.userId FROM UserFriend uf WHERE uf.friendId LIKE CONCAT('%', :friendId, '%')")
    List<Integer> findUserIdsByFriendId(@Param("friendId") String friendId);
}
