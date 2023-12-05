package codexperk.clr.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> allUser(){
        return userRepository.findAll();
    }
    public User user(String userId){
        return userRepository.findByUserId(userId);
    }
    public User saveUser(User user) {
        User existingUser = userRepository.findByUserId(user.getUserId());
        if (existingUser == null) {
            user.setUserId(user.getUserId());
            user.setCart(new HashMap<>());
            user.setPending(new ArrayList<>());
            user.setCheckout(new ArrayList<>());
            return userRepository.save(user);
        } else {
            return existingUser;
        }
    }

}