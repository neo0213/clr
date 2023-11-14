package codexperk.clr;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    public List<Product> allProduct(){
        return productRepository.findAll();
    }

    public Optional<Product> product(ObjectId id){
        return productRepository.findById(id);
    }
}
