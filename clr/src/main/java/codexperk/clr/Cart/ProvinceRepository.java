package codexperk.clr.Cart;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface ProvinceRepository extends MongoRepository<Province, ObjectId> {
    @Query(value = "{ 'province_name' : ?0 }")
    Province findByProvince(String provinceName);
}
