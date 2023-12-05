package codexperk.clr.Pending;

import codexperk.clr.Pending.PendingItem;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Pending {
    private String orderId;
    private String createdAt;
    private String address;
    private String contact;
    private int totalPrice;
    private int shippingFee;
    private List<PendingItem> items;
}
