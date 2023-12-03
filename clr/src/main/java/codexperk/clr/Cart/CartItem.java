package codexperk.clr.Cart;

import codexperk.clr.Product.Product;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItem {
    private Product product;
    private Integer quantity;
}
