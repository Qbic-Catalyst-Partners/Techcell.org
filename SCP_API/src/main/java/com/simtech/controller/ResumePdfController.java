package com.simtech.controller;

import com.simtech.service.ResumePdfService;
import com.simtech.dao.ResumeRepository;
import com.simtech.dao.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.simtech.util.EncryptDecryptUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(maxAge = 3600, origins = { "*" }, methods = { RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.PUT,
		RequestMethod.DELETE, RequestMethod.POST })
public class ResumePdfController {

    @Autowired private ResumePdfService pdfService;
    @Autowired private ResumeRepository resumeRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private EncryptDecryptUtil encryptDecryptUtil;

    /**
     * Returns a generated résumé PDF for the given user.
     * <p>
     * NOTE: For now we call {@link ResumePdfService#generateBlankResumePdf()} as a stub.
     * Once the database aggregation layer is complete we will replace this call
     * with {@code pdfService.generateResumePdfFromDto(resumeDto)}.
     */
    @GetMapping(value = "/{userId}/pdf", produces = "application/pdf")
    public ResponseEntity<byte[]> getResumePdf(@PathVariable Long userId) throws Exception {
        com.simtech.entity.Resume res = resumeRepository.findByUserId(userId);
        if (res == null) {
            // Build a very basic résumé using profile data collected at signup
            com.simtech.entity.UserDetail ud = userRepository.findByUserId(userId);
            if (ud != null) {
                // Map contact information
                ResumePdfService.ContactInfo ci = new ResumePdfService.ContactInfo();
                if (ud.getMobileNo() != null)
                    ci.mobile = encryptDecryptUtil.decrypt(ud.getMobileNo());
                if (ud.getEmailId() != null)
                    ci.email = encryptDecryptUtil.decrypt(ud.getEmailId());
                ci.location = ud.getState();
                ci.linkedIn = ud.getLinkedinProfile();

                byte[] photo = ud.getProfilePhoto();

                byte[] pdfBytes = pdfService.generateResumePdf(
                        ud.getFirstName(),
                        ud.getLastName(),
                        photo,
                        "",      // no objective yet
                        ci,
                        java.util.Collections.emptyList(), // education
                        java.util.Collections.emptyList(), // skills
                        java.util.Collections.emptyList(), // tools
                        java.util.Collections.emptyList(), // experience
                        java.util.Collections.emptyList(), // projects
                        java.util.Collections.emptyList(), // certifications
                        java.util.Collections.emptyList()  // achievements
                );

                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=resume_" + userId + ".pdf")
                        .body(pdfBytes);
            }

            // Fallback: no user details either – return a minimal placeholder PDF
            byte[] blank = pdfService.generateBlankResumePdf();
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=resume_" + userId + ".pdf")
                    .body(blank);
        }
        com.simtech.dto.resume.ResumeDto dto = objectMapper.readValue(res.getResumeData(), com.simtech.dto.resume.ResumeDto.class);

        com.simtech.entity.UserDetail ud = userRepository.findByUserId(userId); // may be null

        byte[] photo = res.getResumePhoto();
        if ((photo == null || photo.length == 0) && ud != null) {
            photo = ud.getProfilePhoto();
        }

        // Merge contact info from user profile if resume data lacks it
        if (ud != null) {
            com.simtech.dto.resume.ContactInfoDto contactDto;
            if (dto.contact != null) {
                contactDto = dto.contact;
            } else if (dto.contactInfoList != null && !dto.contactInfoList.isEmpty()) {
                contactDto = dto.contactInfoList.get(0);
            } else {
                contactDto = new com.simtech.dto.resume.ContactInfoDto();
            }

            if (isBlank(contactDto.mobile) && isBlank(contactDto.mobileNumber)) {
                if (ud.getMobileNo() != null)
                    contactDto.mobile = encryptDecryptUtil.decrypt(ud.getMobileNo());
            }
            if (isBlank(contactDto.email) && isBlank(contactDto.emailId)) {
                if (ud.getEmailId() != null)
                    contactDto.email = encryptDecryptUtil.decrypt(ud.getEmailId());
            }
            if (isBlank(contactDto.location) && isBlank(contactDto.state)) {
                contactDto.location = ud.getState();
            }

            // store back if main contact null
            dto.contact = contactDto;
        }

        byte[] pdfBytes = pdfService.generateResumePdfFromDto(dto, photo);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=resume_" + userId + ".pdf")
                .body(pdfBytes);
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
} 