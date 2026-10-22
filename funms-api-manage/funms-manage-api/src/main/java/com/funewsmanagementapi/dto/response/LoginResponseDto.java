package com.funewsmanagementapi.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDto {
    private String token;
    private String tokenType;
    private Long accountId;
    private String accountName;
    private String accountEmail;
    private Integer accountRole;
    private String roleName; //"Admin" hoặc "staff"
}
