package com.pknu26.roomy.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
// Request DTO는 JSON을 객체로 변환할 때 Jackson이 기본 생성자를 필요로 해서 @NoArgsConstructor를 사용.
@NoArgsConstructor
public class SignUpRequest {
    
    @NotBlank(message = "아이디를 입력해주세요.")
    @Size(min = 6, max = 20,
            message = "아이디는 6~20자입니다.")
    private String username;

    @NotBlank(message = "비밀번호를 입력해주세요.")
    @Size(min = 9, max = 15,
            message = "비밀번호는 9~15자입니다.")
    private String password;
}
