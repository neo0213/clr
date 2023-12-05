package codexperk.clr.Pending;

import codexperk.clr.Product.Product;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PendingItem {
    @DocumentReference
    private Product product;
    private Integer quantity;
    private Integer price;
}
