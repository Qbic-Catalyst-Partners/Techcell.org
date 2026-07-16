package com.simtech.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
@EnableAsync
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Async
    public void sendSimpleEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("contact@techcell.org");
        javaMailSender.send(message);
    }

    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        sendHtmlEmail(to, subject, htmlContent, true);
    }

    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent, boolean includeLogo) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, includeLogo, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // HTML content
            helper.setFrom("contact@techcell.org");
            
            if (includeLogo) {
            // Add logo as inline image
            ClassPathResource logoResource = new ClassPathResource("images/techcell-logo-beta-5.png");
            helper.addInline("techcell-logo", logoResource);
            }
            
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send HTML email", e);
        }
    }

    @Async
    public void sendEmailWithAttachment(String to, String subject, String body, byte[] attachment, String attachmentName) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); // Set to true for HTML content
            helper.setFrom("contact@techcell.org");
            
            // Add logo as inline image
            ClassPathResource logoResource = new ClassPathResource("images/techcell-logo-beta-5.png");
            helper.addInline("techcell-logo", logoResource);
            
            // Add attachment
            if (attachment != null && attachmentName != null) {
                helper.addAttachment(attachmentName, new ByteArrayResource(attachment));
            }
            
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send email with attachment", e);
        }
    }
}