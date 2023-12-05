package codexperk.clr.Product;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface ProductRepository extends MongoRepository<Product, ObjectId> {
    @Query(value = "{ 'prodName' : ?0 }")
    Product findByProdName(String prodName);
}
