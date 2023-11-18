package codexperk.clr.Auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// import codexperk.clr.Auth.ResponseDTO;

@RestController
@RequestMapping("/")
public class Auth0Controller {

    @GetMapping(value = "api/v1/public")
    public ResponseEntity<ResponseDTO> publicEndpoint() {
        return ResponseEntity.ok(new ResponseDTO("Public Endpoint Working fine !"));
    }

    @GetMapping(value = "/**")
    public ResponseEntity<ResponseDTO> privateEndpoint() {
        return ResponseEntity.ok(new ResponseDTO("Private Endpoint Working fine !"));
    }
}
