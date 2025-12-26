package com.college.lostfound.service;

import com.college.lostfound.config.AppProperties;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final AppProperties props;
    private final String mailHost;

    public EmailService(JavaMailSender mailSender, AppProperties props, @Value("${spring.mail.host:}") String mailHost) {
        this.mailSender = mailSender;
        this.props = props;
        this.mailHost = mailHost;
    }

    public boolean send(String to, String subject, String body) {
        if (mailHost == null || mailHost.isBlank()) {
            log.info("Email not configured (spring.mail.host empty). Skipping send to={}", to);
            return false;
        }
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, "UTF-8");
            helper.setFrom(props.getMail().getFrom());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, false);
            mailSender.send(msg);
            return true;
        } catch (Exception e) {
            log.warn("Failed to send email to={}: {}", to, e.getMessage());
            return false;
        }
    }
}

