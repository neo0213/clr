package codexperk.clr.User;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends MongoRepository<User, ObjectId> {
    @Query(value = "{ 'userId' : ?0 }")
    User findByUserId(String userId);
}
