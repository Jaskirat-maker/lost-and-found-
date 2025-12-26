package com.college.lostfound.controller;

import com.college.lostfound.dto.EmailRequest;
import com.college.lostfound.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/email")
public class EmailController {
    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public Map<String, Object> send(@Valid @RequestBody EmailRequest req) {
        boolean sent = emailService.send(req.getTo(), req.getSubject(), req.getBody());
        return Map.of("sent", sent);
    }
}

