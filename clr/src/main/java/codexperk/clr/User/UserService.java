package codexperk.clr.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> allUser(){
        return userRepository.findAll();
    }
    public User user(String userId){
        return userRepository.findByUserId(userId);
    }

}