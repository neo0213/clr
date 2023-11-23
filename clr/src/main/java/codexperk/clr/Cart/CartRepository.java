package codexperk.clr.Cart;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<Cart, String> {
    @Query(value = "{ 'userId' : ?0 }", fields = "{ 'productIds' : 1, 'cartId' : 0 }")
    Optional<Cart> findCartByUserId(String userId);
}
