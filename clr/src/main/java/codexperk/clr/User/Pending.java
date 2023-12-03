// PendingItem.java
package codexperk.clr.User;

import codexperk.clr.Product.Product;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Pending {
    private Product product;
    private Integer quantity;
}
