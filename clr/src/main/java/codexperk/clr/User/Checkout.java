package codexperk.clr.User;

import java.util.List;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Checkout {
    private List<CheckoutItem> items;
    private Integer totalPrice;
    private String location;
    private Integer deliveryFee;
}
