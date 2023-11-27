package codexperk.clr.Cart;

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
}
