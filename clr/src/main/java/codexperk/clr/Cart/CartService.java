    package codexperk.clr.Cart;

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
        private codexperk.clr.User.Checkout Checkout;

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
        


        public User checkout(String userId, CheckoutRequest checkoutRequest){
            User user = userRepository.findByUserId(userId);
            List<String> cart = checkoutRequest.getCart();
            List<Integer> quantity = checkoutRequest.getQuantity();
            String location = checkoutRequest.getLocation();
            Province province = provinceRepository.findByProvince(location);

            if (user != null) {
                List<CheckoutItem> checkoutItems = new ArrayList<>();
                int totalPrice = 0;
                int deliveryFee = calculateDeliveryFee(province.getRegion_code());
                for (int i = 0; i < cart.size(); i++) {
                    Product product = productRepository.findById(new ObjectId(cart.get(i))).get();
                    int individualTotal = product.getPrice() * quantity.get(i);
                    totalPrice += individualTotal;
                    checkoutItems.add(new CheckoutItem(
                            product,
                            quantity.get(i),
                            individualTotal
                    ));
                }
                user.setCheckout(new Checkout(
                        checkoutItems,
                        totalPrice,
                        location,
                        deliveryFee
                ));
                userRepository.save(user);
            }
            return user;
        }


        private int calculateDeliveryFee(String regionCode) {
            return switch (regionCode) {
                case "01", "02", "03", "04", "05" -> // Luzon
                        280;
                case "06", "07", "08" -> // Visayas
                        300;
                case "09", "10", "11", "12", "14", "15", "16", "17" -> // Mindanao
                        330;
                case "13" -> // NCR
                        0;
                default -> 280;
            };
        }

        public Checkout check(CheckoutRequest checkoutRequest){
            List<String> cart = checkoutRequest.getCart();
            List<Integer> quantity = checkoutRequest.getQuantity();
            String location = checkoutRequest.getLocation();
            Province province = provinceRepository.findByProvince(location);

            List<CheckoutItem> checkoutItems = new ArrayList<>();
            int totalPrice = 0;
            int deliveryFee = calculateDeliveryFee(province.getRegion_code());
            for (int i = 0; i < cart.size(); i++) {
                Product product = productRepository.findById(new ObjectId(cart.get(i))).get();
                int individualTotal = product.getPrice() * quantity.get(i);
                totalPrice += individualTotal;
                checkoutItems.add(new CheckoutItem(
                        product,
                        quantity.get(i),
                        individualTotal
                ));
            }
            return new Checkout(checkoutItems,
                    totalPrice,
                    location,
                    deliveryFee
            );
        }
    }