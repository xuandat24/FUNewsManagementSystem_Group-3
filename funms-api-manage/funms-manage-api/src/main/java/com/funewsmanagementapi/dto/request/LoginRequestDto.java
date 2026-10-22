package com.funewsmanagementapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDto {

    @NotBlank(message = "Email hoặc tên không được để trống!")
    private String identifier; // chấp nhận email hoặc usernam

    @NotBlank(message = "Mật khẩu không được để trống!")
    private String password;

}
