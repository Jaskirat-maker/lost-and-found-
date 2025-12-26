package com.college.lostfound.controller;

import com.college.lostfound.dto.ItemCreateRequest;
import com.college.lostfound.dto.ItemResponse;
import com.college.lostfound.model.ItemType;
import com.college.lostfound.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping
    public ItemResponse create(@Valid @RequestBody ItemCreateRequest req) {
        return itemService.create(req);
    }

    @GetMapping("/me")
    public List<ItemResponse> myReports() {
        return itemService.myReports();
    }

    @GetMapping("/public")
    public List<ItemResponse> publicReports(@RequestParam(value = "type", required = false) ItemType type) {
        return itemService.publicReports(type);
    }
}

