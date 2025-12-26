package edu.college.lostfound.service;

import edu.college.lostfound.dto.ItemResponse;
import edu.college.lostfound.entity.Item;
import edu.college.lostfound.enums.ItemStatus;
import edu.college.lostfound.enums.ItemType;
import edu.college.lostfound.exception.BadRequestException;
import edu.college.lostfound.repository.ItemRepository;
import edu.college.lostfound.util.DtoMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {
    private final ItemRepository itemRepository;
    private final EmailService emailService;

    public AdminService(ItemRepository itemRepository, EmailService emailService) {
        this.itemRepository = itemRepository;
        this.emailService = emailService;
    }

    public List<ItemResponse> list(ItemStatus status, ItemType type) {
        return itemRepository.adminSearch(status, type).stream()
                .map(DtoMapper::toItemResponse)
                .toList();
    }

    @Transactional
    public ItemResponse approve(Long id) {
        Item item = itemRepository.findById(id).orElseThrow(() -> new BadRequestException("Item not found"));
        if (item.getStatus() != ItemStatus.PENDING) {
            throw new BadRequestException("Only PENDING items can be approved");
        }
        item.setStatus(ItemStatus.APPROVED);
        itemRepository.save(item);

        String to = item.getUser().getEmail();
        emailService.send(to, "Your lost & found report was approved",
                "Hello " + item.getUser().getName() + ",\n\n" +
                        "Your report for \"" + item.getItemName() + "\" has been approved by the registrar.\n\n" +
                        "You can track the status in the Lost & Found portal.\n\n" +
                        "Regards,\nRegistrar Office");

        return DtoMapper.toItemResponse(item);
    }

    @Transactional
    public ItemResponse reject(Long id, String reason) {
        Item item = itemRepository.findById(id).orElseThrow(() -> new BadRequestException("Item not found"));
        if (item.getStatus() != ItemStatus.PENDING) {
            throw new BadRequestException("Only PENDING items can be rejected");
        }
        item.setStatus(ItemStatus.REJECTED);
        itemRepository.save(item);

        String to = item.getUser().getEmail();
        String body = "Hello " + item.getUser().getName() + ",\n\n" +
                "Your report for \"" + item.getItemName() + "\" was rejected by the registrar.\n" +
                (reason == null || reason.isBlank() ? "" : ("\nReason: " + reason.trim() + "\n")) +
                "\nIf you believe this is a mistake, please contact the registrar.\n\n" +
                "Regards,\nRegistrar Office";
        emailService.send(to, "Your lost & found report was rejected", body);

        return DtoMapper.toItemResponse(item);
    }

    @Transactional
    public List<ItemResponse> match(Long lostItemId, Long foundItemId) {
        if (lostItemId.equals(foundItemId)) {
            throw new BadRequestException("Cannot match an item to itself");
        }
        Item lost = itemRepository.findById(lostItemId).orElseThrow(() -> new BadRequestException("Lost item not found"));
        Item found = itemRepository.findById(foundItemId).orElseThrow(() -> new BadRequestException("Found item not found"));

        if (lost.getType() != ItemType.LOST) {
            throw new BadRequestException("lostItemId must be type LOST");
        }
        if (found.getType() != ItemType.FOUND) {
            throw new BadRequestException("foundItemId must be type FOUND");
        }
        if (lost.getStatus() != ItemStatus.APPROVED || found.getStatus() != ItemStatus.APPROVED) {
            throw new BadRequestException("Both items must be APPROVED before matching");
        }
        if (lost.getMatchedItem() != null || found.getMatchedItem() != null) {
            throw new BadRequestException("One of the items is already matched");
        }

        lost.setStatus(ItemStatus.MATCHED);
        found.setStatus(ItemStatus.MATCHED);
        lost.setMatchedItem(found);
        found.setMatchedItem(lost);
        itemRepository.save(lost);
        itemRepository.save(found);

        String subject = "Match found for your lost & found report";
        emailService.send(lost.getUser().getEmail(), subject,
                "Hello " + lost.getUser().getName() + ",\n\n" +
                        "Good news! A found item report appears to match your lost item: \"" + lost.getItemName() + "\".\n\n" +
                        "Please contact the registrar to verify and collect your item.\n\n" +
                        "Regards,\nRegistrar Office");

        emailService.send(found.getUser().getEmail(), subject,
                "Hello " + found.getUser().getName() + ",\n\n" +
                        "Thank you for reporting a found item: \"" + found.getItemName() + "\".\n" +
                        "The registrar has matched it to a lost item report.\n\n" +
                        "If needed, the registrar may contact you for verification.\n\n" +
                        "Regards,\nRegistrar Office");

        return List.of(DtoMapper.toItemResponse(lost), DtoMapper.toItemResponse(found));
    }
}

