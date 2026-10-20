package com.funewsmanagementapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TagRequestDto {
    @NotBlank(message = "Tên tag không được để trống!")
    @Size(max = 50, message = "Tên tag không được dài quá 50 kí tự!")
    private String tagName;
    private String note;
}
