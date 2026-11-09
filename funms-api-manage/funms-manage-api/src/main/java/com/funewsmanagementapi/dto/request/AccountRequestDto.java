package com.funewsmanagementapi.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountRequestDto {
    @NotBlank(message = "Tên tài khoản không được để trống")
    @Size(max = 100, message = "Tên tài khoản tối đa 100 ký tự")
    private String accountName;
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    @Size(max = 100, message = "Email tối đa 100 ký tự")
    private String accountEmail;
    @NotNull(message = "Vai trò không được để trống")
    private Integer accountRole;
    private String accountPassword;
}
