package codexperk.clr.Cart;

import codexperk.clr.Pending.PendingItem;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Check {
    private List<PendingItem> items;
    private int totalPrice;
    private int shippingFee;
}