package codexperk.clr.Checkout;

import java.util.List;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "checkout")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Checkout {
    @Id
    private ObjectId id;
    private String address;
    private String contact;
    private String totalPrice;
    private String shippingFee;
    private List<CheckoutItem> items;
}
