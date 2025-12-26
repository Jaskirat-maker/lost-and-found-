package com.college.lostfound.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DecisionRequest {
    @Size(max = 500)
    private String reason;
}

