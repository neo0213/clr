package codexperk.clr.Cart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;
    public List<Cart> allCart(){
        return cartRepository.findAll();
    }

    public Optional<Cart> cart(String userId){
        return cartRepository.findCartByUserId(userId);
    }
}