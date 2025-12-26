package edu.college.lostfound.dto;

import edu.college.lostfound.enums.ItemType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ItemCreateRequest {
    @NotBlank
    @Size(max = 255)
    private String itemName;

    @NotBlank
    @Size(max = 120)
    private String category;

    @NotBlank
    @Size(max = 4000)
    private String description;

    @NotBlank
    @Size(max = 255)
    private String location;

    @NotNull
    private LocalDate date;

    private String imageUrl;

    @NotNull
    private ItemType type;
}

