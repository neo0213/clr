package codexperk.clr.User;

import codexperk.clr.Product.Product;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Checkout {
    private Integer totalPrice;
    private String location;
    private Integer deliveryFee;
}
