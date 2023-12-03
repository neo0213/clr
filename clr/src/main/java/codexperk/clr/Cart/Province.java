package codexperk.clr.Cart;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "province")
@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Province {
    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;
    private String province_code;
    private String province_name;
    private String psgc_code;
    private String region_code;
}