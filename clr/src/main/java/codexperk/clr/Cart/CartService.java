    package codexperk.clr.Cart;

    import codexperk.clr.Product.Product;
    import codexperk.clr.Product.ProductRepository;
    import codexperk.clr.User.Checkout;
    import codexperk.clr.User.Pending;
    import codexperk.clr.User.User;
    import codexperk.clr.User.UserRepository;
    import org.bson.types.ObjectId;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

    import java.util.ArrayList;
    import java.util.List;


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

        public User checkout(String userId, CheckoutRequest checkoutRequest){
            User user = userRepository.findByUserId(userId);
            List<String> cart = checkoutRequest.getCart();
            List<Integer> quantity = checkoutRequest.getQuantity();
            String location = checkoutRequest.getLocation();
            Province province = provinceRepository.findByProvince(location);

            if (user != null) {
                List<Pending> pendingItems = new ArrayList<>();
                int totalPrice = 0;
                int deliveryFee = 0;
                for (int i = 0; i < cart.size(); i++) {
                    Product product = productRepository.findById(new ObjectId(cart.get(i))).get();
                    totalPrice = product.getPrice() * quantity.get(i);
                    deliveryFee = calculateDeliveryFee(province.getRegion_code());
                    pendingItems.add(new Pending(
                            product,
                            quantity.get(i)
                    ));
                }
                user.setCheckout(new Checkout(
                        totalPrice,
                        location,
                        deliveryFee
                ));
                user.setPending(pendingItems);
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

            int totalPrice = 0;
            int deliveryFee = 0;
            for (int i = 0; i < cart.size(); i++) {
                Product product = productRepository.findById(new ObjectId(cart.get(i))).get();
                totalPrice = product.getPrice() * quantity.get(i);
                deliveryFee = calculateDeliveryFee(province.getRegion_code());
            }
            return new Checkout(totalPrice, location, deliveryFee);
        }
    }