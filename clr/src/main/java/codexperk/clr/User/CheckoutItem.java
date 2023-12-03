package codexperk.clr.User;

import codexperk.clr.Product.Product;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckoutItem {
    private Product product;
    private Integer quantity;
    private Integer price;
}

