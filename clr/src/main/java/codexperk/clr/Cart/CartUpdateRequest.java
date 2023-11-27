package codexperk.clr.Cart;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CartUpdateRequest {
    private List<String> productsToAdd;
    private List<String> productsToRemove;

}
