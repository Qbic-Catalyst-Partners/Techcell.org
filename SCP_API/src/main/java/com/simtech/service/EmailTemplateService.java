package com.simtech.service;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

@Service
public class EmailTemplateService {
    
    /**
     * Gets the welcome email HTML template
     */
    public String getWelcomeEmailTemplate() {
        // If you're storing the template as a file in resources
        try {
            return readTemplateFromFile("templates/welcome-email-template.html");
        } catch (IOException e) {
            // Fallback to the hardcoded template if file reading fails
            return getHardcodedWelcomeTemplate();
        }
    }
    
    /**
     * Prepares a welcome email by replacing placeholders with actual values
     */
    public String prepareWelcomeEmail(String firstName, String lastName, boolean isStudent) {
        String template = getWelcomeEmailTemplate();
        
        String paymentNote = isStudent 
            ? "Please find your payment invoice attached to this email for your records."
            : "";
        
        // Replace placeholders with actual values
        template = template.replace("{{firstName}}", firstName)
                           .replace("{{lastName}}", lastName)
                           .replace("{{paymentNote}}", paymentNote);
        
        return template;
    }
    
    /**
     * Reads a template file from the classpath resources
     */
    private String readTemplateFromFile(String path) throws IOException {
        Resource resource = new ClassPathResource(path);
        try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            return FileCopyUtils.copyToString(reader);
        }
    }
    
    /**
     * Provides a hardcoded welcome email template as a fallback
     */
    private String getHardcodedWelcomeTemplate() {
        return "<!DOCTYPE html>\n" +
               "<html lang=\"en\">\n" +
               "<head>\n" +
               "    <meta charset=\"UTF-8\">\n" +
               "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
               "    <title>Welcome to TechCell</title>\n" +
               "</head>\n" +
               "<body style=\"font-size: 14px; color: #222222; font-family: Arial, sans-serif; margin: 0; padding: 0;\">\n" +
               "    <div style=\"max-width: 600px; padding: 20px; margin: 0 auto;\">\n" +
               "        <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
               "            <tr>\n" +
               "                <td>\n" +
               "                    <img src=\"cid:techcell-logo\" alt=\"TechCell Logo\" width=\"48\" style=\"margin-bottom: 16px;\">\n" +
               "                </td>\n" +
               "            </tr>\n" +
               "        </table>\n" +
               "        \n" +
               "        <h4 style=\"font-weight: 600; font-size: 20px; margin: 0; margin-bottom: 16px;\">Welcome to TechCell</h4>\n" +
               "        \n" +
               "        <h6 style=\"font-size: 14px; font-weight: 600; margin: 0; margin-bottom: 16px; color: #144557;\">Hi {{firstName}} {{lastName}},</h6>\n" +
               "        \n" +
               "        <p style=\"line-height: 150%; margin-bottom: 15px;\">\n" +
               "            We are thrilled to have you join our community. We believe in the power\n" +
               "            of innovation and collaboration.\n" +
               "        </p>\n" +
               "        \n" +
               "        <p style=\"line-height: 150%; margin-bottom: 15px;\">\n" +
               "            TechCell is committed to empower students to reach their full potential.\n" +
               "            Here, you'll find community of like-minded individuals, resources,\n" +
               "            mentorship, projects, certifications and career opportunities to help\n" +
               "            enhance your skills and advance your career.\n" +
               "        </p>\n" +
               "        \n" +
               "        <p style=\"line-height: 150%; margin-bottom: 15px;\">\n" +
               "            Your journey with us is just the beginning, and we are excited to see\n" +
               "            incredible things you will learn and achieve as a TechCell member.\n" +
               "        </p>\n" +
               "        \n" +
               "        <p style=\"line-height: 150%; margin-bottom: 25px;\">\n" +
               "            Welcome aboard, and let's embark on this exciting journey together!\n" +
               "        </p>\n" +
               "        \n" +
               "        <!-- Only for student role -->\n" +
               "        <p style=\"line-height: 150%; margin-bottom: 25px; font-style: italic; color: #555;\">\n" +
               "            {{paymentNote}}\n" +
               "        </p>\n" +
               "        \n" +
               "        <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"margin-top: 30px;\">\n" +
               "            <tr>\n" +
               "                <td>\n" +
               "                    <h6 style=\"font-size: 14px; font-weight: 600; margin: 0; margin-bottom: 4px; margin-top: 32px;\">Praveen Kumar</h6>\n" +
               "                    <p style=\"margin: 0; color: #666;\">Founder, TechCell.org</p>\n" +
               "                </td>\n" +
               "            </tr>\n" +
               "        </table>\n" +
               "    </div>\n" +
               "</body>\n" +
               "</html>";
    }
}