package codexperk.clr.Cart;

import codexperk.clr.User.Checkout;
import codexperk.clr.User.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/cart")
public class CartController {
    @Autowired
    private CartService cartService;
    @PostMapping("/{userId}")
    public User updateCart(@PathVariable String userId, @RequestBody CartUpdateRequest cartUpdateRequest) {
        return cartService.updateCart(userId, cartUpdateRequest);
    }
    @PostMapping("/checkout/{userId}")
    public User checkout(@PathVariable String userId, @RequestBody CheckoutRequest checkoutRequest){
        return cartService.checkout(userId, checkoutRequest);
    }
    @PostMapping("/check")
    public Checkout check(@RequestBody CheckoutRequest checkoutRequest){
        return cartService.check(checkoutRequest);
    }
}
