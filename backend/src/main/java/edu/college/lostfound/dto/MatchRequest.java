package edu.college.lostfound.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MatchRequest {
    @NotNull
    private Long lostItemId;

    @NotNull
    private Long foundItemId;
}

