package codexperk.clr.Cart;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class CartUpdateRequest {
    private Map<String, Integer> productsToAddWithQuantity;
    private List<String> productsToRemove;

}
