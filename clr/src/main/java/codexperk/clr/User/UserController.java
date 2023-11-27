package codexperk.clr.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUser(){
        return new ResponseEntity<List<User>>(userService.allUser(), HttpStatus.OK);
    }
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable String userId){
        return new ResponseEntity<User>(userService.user(userId), HttpStatus.OK);
    }

}
