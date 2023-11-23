package codexperk.clr.Auth;

import lombok.Getter;

@Getter
public class ResponseDTO {

    private String message;

    public ResponseDTO(String message) {
        super();
        this.message = message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
