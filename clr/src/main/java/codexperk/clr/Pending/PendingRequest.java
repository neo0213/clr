package codexperk.clr.Pending;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PendingRequest {
    private List<String> productsToAdd;
    private List<Integer> quantity;
    private String address;
    private String contact;
    private String province;
}

