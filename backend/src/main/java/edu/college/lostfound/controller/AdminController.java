package edu.college.lostfound.controller;

import edu.college.lostfound.dto.DecisionRequest;
import edu.college.lostfound.dto.ItemResponse;
import edu.college.lostfound.dto.MatchRequest;
import edu.college.lostfound.enums.ItemStatus;
import edu.college.lostfound.enums.ItemType;
import edu.college.lostfound.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/items")
    public List<ItemResponse> list(
            @RequestParam(value = "status", required = false) ItemStatus status,
            @RequestParam(value = "type", required = false) ItemType type
    ) {
        return adminService.list(status, type);
    }

    @PutMapping("/items/{id}/approve")
    public ItemResponse approve(@PathVariable Long id) {
        return adminService.approve(id);
    }

    @PutMapping("/items/{id}/reject")
    public ItemResponse reject(@PathVariable Long id, @Valid @RequestBody(required = false) DecisionRequest req) {
        return adminService.reject(id, req == null ? null : req.getReason());
    }

    @PostMapping("/match")
    public List<ItemResponse> match(@Valid @RequestBody MatchRequest req) {
        return adminService.match(req.getLostItemId(), req.getFoundItemId());
    }
}

