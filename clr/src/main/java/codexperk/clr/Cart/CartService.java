package codexperk.clr.Cart;

import codexperk.clr.Pending.PendingItem;
import codexperk.clr.Pending.PendingService;
import codexperk.clr.Product.Product;
import codexperk.clr.Product.ProductRepository;
import codexperk.clr.User.*;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Service
public class CartService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProvinceRepository provinceRepository;

    public User updateCart(String userId, CartUpdateRequest cartUpdateRequest) {
        User user = userRepository.findByUserId(userId);

        if (user != null) {
            if (cartUpdateRequest.getProductsToAddWithQuantity() != null) {
                for (Map.Entry<String, Integer> entry : cartUpdateRequest.getProductsToAddWithQuantity().entrySet()) {
                    String productId = entry.getKey();
                    Integer newQuantity = entry.getValue();

                    if (user.getCart().containsKey(productId)) {
                        Integer currentQuantity = user.getCart().get(productId);
                        user.getCart().put(productId, currentQuantity + newQuantity);
                    } else {
                        user.getCart().put(productId, newQuantity);
                    }
                }
            }

            if (cartUpdateRequest.getProductsToRemove() != null) {
                for (String productId : cartUpdateRequest.getProductsToRemove()) {
                    user.getCart().remove(productId);
                }
            }

            return userRepository.save(user);
        }

        return null; // Handle the case where the user is not found
    }
    public Check check(CartCheckRequest cartCheckRequest){
        PendingService service;
        service = new PendingService();

        List<String> cart = cartCheckRequest.getCart();
        List<Integer> quantity = cartCheckRequest.getQuantity();
        String location = cartCheckRequest.getProvince();
        Province province = provinceRepository.findByProvince(location);

        List<PendingItem> pendingItems = new ArrayList<>();
        int totalPrice = 0;
        int deliveryFee = service.calculateShippingFee(province.getRegion_code());
        for (int i = 0; i < cart.size(); i++) {
            Product product = productRepository.findById(new ObjectId(cart.get(i))).get();
            int individualTotal = product.getPrice() * quantity.get(i);
            totalPrice += individualTotal;
            pendingItems.add(new PendingItem(
                    product,
                    quantity.get(i),
                    individualTotal
            ));
        }
        return new Check(
                pendingItems,
                totalPrice,
                deliveryFee
        );
    }
}