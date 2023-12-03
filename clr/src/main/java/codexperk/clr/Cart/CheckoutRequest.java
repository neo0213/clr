package codexperk.clr.Cart;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CheckoutRequest {
    private List<String> cart;
    private List<Integer> quantity;
    private String location;
}

