package codexperk.clr.Cart;

import codexperk.clr.Product.ProductRepository;
import codexperk.clr.User.User;
import codexperk.clr.User.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class CartService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    public User updateCart(String userId, CartUpdateRequest cartUpdateRequest) {
        User user = userRepository.findByUserId(userId);

        if (user != null) {
            if (cartUpdateRequest.getProductsToAdd() != null) {
                for (String productId : cartUpdateRequest.getProductsToAdd()) {
                    productRepository.findById(new ObjectId(productId)).ifPresent(product -> user.getCart().add(product));
                }
            }

            if (cartUpdateRequest.getProductsToRemove() != null) {
                for (String productId : cartUpdateRequest.getProductsToRemove()) {
                    productRepository.findById(new ObjectId(productId)).ifPresent(product -> user.getCart().remove(product));
                }
            }

            return userRepository.save(user);
        }

        return null; // Handle the case where the user is not found
    }
}