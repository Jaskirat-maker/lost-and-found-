package com.college.lostfound.util;

import com.college.lostfound.dto.ItemResponse;
import com.college.lostfound.dto.UserDto;
import com.college.lostfound.model.Item;
import com.college.lostfound.model.User;

public class DtoMapper {
    private DtoMapper() {
    }

    public static UserDto toUserDto(User u) {
        return new UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole());
    }

    public static ItemResponse toItemResponse(Item i) {
        Long matchedId = i.getMatchedItem() == null ? null : i.getMatchedItem().getId();
        UserDto reporter = i.getUser() == null ? null : toUserDto(i.getUser());
        return new ItemResponse(
                i.getId(),
                i.getItemName(),
                i.getCategory(),
                i.getDescription(),
                i.getLocation(),
                i.getDate(),
                i.getImageUrl(),
                i.getStatus(),
                i.getType(),
                matchedId,
                reporter,
                i.getCreatedAt()
        );
    }
}

