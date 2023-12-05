package codexperk.clr.Pending;

import codexperk.clr.User.User;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/checkout")
public class PendingController {
    @Autowired
    private PendingService pendingService;

    @PostMapping("/{userId}")
    public User checkout(@PathVariable String userId, @RequestBody PendingRequest pendingRequest){
        return pendingService.checkout(userId, pendingRequest);
    }
}
