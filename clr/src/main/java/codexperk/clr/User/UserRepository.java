package codexperk.clr.User;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends MongoRepository<User, ObjectId> {
    @Query(value = "{ 'userId' : ?0 }")
    User findByUserId(String userId);
    @Query(value = "{ 'pending.orderId' : ?0 }")
    Optional<User> findByOrderIdInPending(String orderId);

    public interface UserIdProjection {
        String getUserId();
    }
    @Query(value = "{}", fields = "{ 'userId' : 1}")
    List<UserIdProjection> findAllUserIds();

}
