package edu.college.lostfound.service;

import edu.college.lostfound.dto.ItemCreateRequest;
import edu.college.lostfound.dto.ItemResponse;
import edu.college.lostfound.entity.Item;
import edu.college.lostfound.entity.User;
import edu.college.lostfound.enums.ItemStatus;
import edu.college.lostfound.enums.ItemType;
import edu.college.lostfound.exception.NotFoundException;
import edu.college.lostfound.repository.ItemRepository;
import edu.college.lostfound.util.DtoMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {
    private final ItemRepository itemRepository;
    private final UserService userService;

    public ItemService(ItemRepository itemRepository, UserService userService) {
        this.itemRepository = itemRepository;
        this.userService = userService;
    }

    public ItemResponse create(ItemCreateRequest req) {
        User user = userService.getCurrentUser();
        Item item = new Item();
        item.setItemName(req.getItemName().trim());
        item.setCategory(req.getCategory().trim());
        item.setDescription(req.getDescription().trim());
        item.setLocation(req.getLocation().trim());
        item.setDate(req.getDate());
        item.setImageUrl(req.getImageUrl());
        item.setType(req.getType());
        item.setStatus(ItemStatus.PENDING);
        item.setUser(user);
        itemRepository.save(item);
        return DtoMapper.toItemResponse(item);
    }

    public List<ItemResponse> myReports() {
        User user = userService.getCurrentUser();
        return itemRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(DtoMapper::toItemResponse)
                .toList();
    }

    public List<ItemResponse> publicReports(ItemType type) {
        return itemRepository.adminSearch(ItemStatus.APPROVED, type).stream()
                .map(DtoMapper::toItemResponse)
                .toList();
    }

    public Item getById(Long id) {
        return itemRepository.findById(id).orElseThrow(() -> new NotFoundException("Item not found"));
    }
}

