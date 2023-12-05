package codexperk.clr.Product;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
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

    public Product createProduct(Product product){
        if (product.getImg() == null || product.getImg().isEmpty() ||
                product.getCategory() == null || product.getCategory().isEmpty() ||
                product.getPrice() == null) {
            throw new IllegalArgumentException("Product image, category, and price must not be empty");
        }

        Product existingProdName = productRepository.findByProdName(product.getProdName());
        return Objects.requireNonNullElseGet(existingProdName, () -> productRepository.save(product));
    }

    public String deleteProduct(String prodName){
        Product product = productRepository.findByProdName(prodName);
        if (product != null){
            productRepository.delete(product);
            return "Product deleted successfully";
        } else {
            return "Product not found";
        }
    }
}
