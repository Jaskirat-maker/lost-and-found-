package edu.college.lostfound.dto;

import edu.college.lostfound.enums.ItemStatus;
import edu.college.lostfound.enums.ItemType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@AllArgsConstructor
public class ItemResponse {
    private Long id;
    private String itemName;
    private String category;
    private String description;
    private String location;
    private LocalDate date;
    private String imageUrl;
    private ItemStatus status;
    private ItemType type;
    private Long matchedItemId;
    private UserDto reporter;
    private OffsetDateTime createdAt;
}

