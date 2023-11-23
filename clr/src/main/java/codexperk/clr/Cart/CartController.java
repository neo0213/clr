package codexperk.clr.Cart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/cart")
public class CartController {
    @Autowired
    private CartService cartService;
    @GetMapping
    public ResponseEntity<List<Cart>> getAllCarts(){
        return new ResponseEntity<List<Cart>>(cartService.allCart(),HttpStatus.OK);
    }
    @GetMapping("/{userId}")
    public ResponseEntity<Optional<Cart>> getCart(@PathVariable String userId){
        return new ResponseEntity<Optional<Cart>>(cartService.cart(userId), HttpStatus.OK);
    }
}
