package codexperk.clr.Pending;

import codexperk.clr.Cart.Province;
import codexperk.clr.Cart.ProvinceRepository;
import codexperk.clr.Product.Product;
import codexperk.clr.Product.ProductRepository;
import codexperk.clr.User.*;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.Random;
import java.util.ArrayList;
import java.util.List;


@Service
public class PendingService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProvinceRepository provinceRepository;

    public User checkout(String userId, PendingRequest pendingRequest){
        User user = userRepository.findByUserId(userId);
        List<String> productsToAdd = pendingRequest.getProductsToAdd();
        List<Integer> quantity = pendingRequest.getQuantity();
        String address = pendingRequest.getAddress();
        String contact = pendingRequest.getContact();
        String location = pendingRequest.getProvince();
        Province province = provinceRepository.findByProvince(location);


        if (user != null) {
            List<PendingItem> pendingItems = new ArrayList<>();
            String orderId = generateId();
            String createdAt = getDate();
            int totalPrice = 0;
            int shippingFee = calculateShippingFee(province.getRegion_code());

            for (int i = 0; i < productsToAdd.size(); i++) {
                Product product = productRepository.findById(new ObjectId(productsToAdd.get(i))).get();
                int individualTotal = product.getPrice() * quantity.get(i);
                totalPrice += individualTotal;

                pendingItems.add(new PendingItem(
                        product,
                        quantity.get(i),
                        individualTotal
                ));
            }
            Pending newOrder = new Pending(
                    orderId,
                    createdAt,
                    address,
                    contact,
                    totalPrice,
                    shippingFee,
                    pendingItems
            );
            List<Pending> pendingOrders = user.getPending();
            if (pendingOrders == null) {
                pendingOrders = new ArrayList<>();
            }
            pendingOrders.add(newOrder);
            user.setPending(pendingOrders);
            userRepository.save(user);
        }
        return user;
    }
    private String getDate() {
        ZonedDateTime nowInPH = ZonedDateTime.now(ZoneId.of("Asia/Manila"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
        return nowInPH.format(formatter);
    }
    private String generateId() {
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Manila"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HHmmss");
        String time = now.format(formatter);
        Random random = new Random();
        int randomNumber = random.nextInt(100); // generates a random number between 0 (inclusive) and 100 (exclusive)
        return time + String.format("%02d", randomNumber); // pads the random number with leading zeros if it's less than 10
    }

    public int calculateShippingFee(String regionCode) {
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
    public User approve(String orderId) {
        User updatedUser = null;
        Optional<User> userOptional = userRepository.findByOrderIdInPending(orderId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            Pending orderToCheckout = null;
            List<Pending> pendingOrders = user.getPending();

            for (Pending order : pendingOrders) {
                if (order.getOrderId().equals(orderId)) {
                    orderToCheckout = order;
                    break;
                }
            }

            if (orderToCheckout != null) {
                pendingOrders.remove(orderToCheckout);
                user.getCheckout().add(orderToCheckout);
                updatedUser = userRepository.save(user);
            }
        }
        return updatedUser;
    }
}
