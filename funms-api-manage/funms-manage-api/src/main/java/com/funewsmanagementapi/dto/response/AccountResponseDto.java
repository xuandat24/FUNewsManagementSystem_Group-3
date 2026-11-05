package com.funewsmanagementapi.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountResponseDto {
    private Long accountId;
    private String accountName;
    private String accountEmail;
    private Integer accountRole;
}
