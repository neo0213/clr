package codexperk.clr.Product;

import codexperk.clr.User.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, ObjectId> {
    @Query(value = "{ 'prodName' : ?0 }")
    Product findByProdName(String prodName);
}
