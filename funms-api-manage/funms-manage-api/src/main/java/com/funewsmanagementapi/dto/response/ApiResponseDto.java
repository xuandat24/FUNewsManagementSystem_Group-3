package com.funewsmanagementapi.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponseDto<T> {
    private int status;
    private String message;
    private T data;

    public static <T> ApiResponseDto<T> success(String message, T data){
        return ApiResponseDto.<T>builder()
                .status(200)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponseDto<T> error(int status, String message){
        return ApiResponseDto.<T>builder()
                .status(status)
                .message(message)
                .data(null)
                .build();
    }
}
