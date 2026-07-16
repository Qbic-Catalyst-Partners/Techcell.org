package com.simtech.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.ColumnText;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfPageEventHelper;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
// NEW IMPORTS FOR TABLE LAYOUT
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Collectors;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Locale;
import com.simtech.dto.resume.ResumeDto;
import com.simtech.dto.resume.SimpleTextDto;

@Service
public class ResumePdfService {

    // Font that supports the Unicode arrow (➤ U+27A4). Expects the TTF to be placed under
    // src/main/resources/fonts/DejaVuSans.ttf (or any Unicode font of your choice).
    // If the font file cannot be loaded, we gracefully fall back to Helvetica so the app
    // still runs, but the arrow might be missing.
    private static final Font ARROW_FONT;
    static {
        Font tmp;
        try {
            // Read font bytes from classpath (src/main/resources)
            byte[] fontBytes = new org.springframework.core.io.ClassPathResource("fonts/DejaVuSans.ttf")
                    .getInputStream()
                    .readAllBytes();
            BaseFont bf = BaseFont.createFont("DejaVuSans.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED,
                    true, fontBytes, null);
            tmp = new Font(bf, 8, Font.NORMAL, Color.WHITE);
        } catch (Exception ex) {
            tmp = new Font(Font.HELVETICA, 8, Font.NORMAL, Color.WHITE);
        }
        ARROW_FONT = tmp;
    }

    private static final Font ARROW_FONT_BLACK;
    static {
        Font tmpBlack;
        try {
            BaseFont bf = ARROW_FONT.getBaseFont();
            tmpBlack = new Font(bf, 8, Font.NORMAL, Color.BLACK);
        } catch (Exception ex) {
            tmpBlack = new Font(Font.HELVETICA, 8, Font.NORMAL, Color.BLACK);
        }
        ARROW_FONT_BLACK = tmpBlack;
    }

    // ------------------------ ARIAL FONTS ------------------------
    private static final BaseFont ARIAL_REGULAR_BF;
    private static final BaseFont ARIAL_MEDIUM_BF;
    private static final BaseFont ARIAL_BOLD_BF; // true bold weight
    static {
        BaseFont reg = null;
        BaseFont medium = null;
        BaseFont bold = null;
        try {
            byte[] regBytes = new org.springframework.core.io.ClassPathResource("fonts/arial.ttf")
                    .getInputStream().readAllBytes();
            reg = BaseFont.createFont("arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED,
                    true, regBytes, null);

            byte[] mediumBytes = new org.springframework.core.io.ClassPathResource("fonts/arial-medium.ttf")
                    .getInputStream().readAllBytes();
            medium = BaseFont.createFont("arial-medium.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED,
                    true, mediumBytes, null);

            // Load bold face
            byte[] boldBytes = new org.springframework.core.io.ClassPathResource("fonts/arial-bold.ttf")
                    .getInputStream().readAllBytes();
            bold = BaseFont.createFont("arial-bold.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED,
                    true, boldBytes, null);
        } catch (Exception e) {
            try {
                reg = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                medium = reg;
                bold = reg;
            } catch (Exception ignore) {}
        }
        ARIAL_REGULAR_BF = reg;
        ARIAL_MEDIUM_BF = medium;
        ARIAL_BOLD_BF = bold;
    }

    public static class ContactInfo {
        public String mobile;
        public String email;
        public String location;
        public String linkedIn;
    }

    public static class Education {
        public String startYear;
        public String endYear;
        public String school;
        public String degree;
        public String field;
        public String gpa;
    }

    public static class Experience {
        public String title;
        public String company;
        public String start;
        public String end;
        public String description;
    }

    public static class Project {
        public String title;
        public String start;
        public String end;
        public String description;
    }

    public byte[] generateResumePdf(
            String firstName,
            String lastName,
            byte[] photo,
            String objective,
            ContactInfo contact,
            List<Education> educationList,
            List<String> skills,
            List<String> tools,
            List<Experience> experienceList,
            List<Project> projectList,
            List<String> certifications,
            List<String> achievements
    ) throws Exception {
        Document doc = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(doc, baos);
        writer.setPageEvent(new SidebarEvent());
        doc.setMargins(0, 0, 0, 0);
        doc.open();

        float sidebarWidth = 178f; // 30% of 595pt
        float INNER_PAD = 20f;      // inner padding inside sidebar
        float gap = INNER_PAD;

        // ---------- Sidebar column ----------
        ColumnText sidebar = new ColumnText(writer.getDirectContent());
        sidebar.setSimpleColumn(doc.left() + INNER_PAD, doc.bottom() + INNER_PAD,
                doc.left() + sidebarWidth - INNER_PAD, doc.top() - INNER_PAD);

        Font whiteNormal = new Font(ARIAL_REGULAR_BF, 9, Font.NORMAL, Color.WHITE);  // sidebar body same size as main body
        Font whiteSmallCaps = new Font(ARIAL_MEDIUM_BF, 10, Font.NORMAL, Color.WHITE); // section titles
        Font arrowFont = ARROW_FONT;

        // Photo
        if (photo != null) {
            Image img = Image.getInstance(photo);
            img.scaleToFit(120, 120); // avatar 120px

            float x = doc.left() + INNER_PAD + ((sidebarWidth - 2 * INNER_PAD) - img.getScaledWidth()) / 2; // bottom-left X of image
            float y = doc.top() - INNER_PAD - img.getScaledHeight();

            // Calculate center and radius for circular mask
            float radius = img.getScaledWidth() / 2f;
            float xCenter = x + radius;
            float yCenter = y + radius;

            PdfContentByte cb = writer.getDirectContent();

            // Clip to a circle so the image itself is round
            cb.saveState();
            cb.circle(xCenter, yCenter, radius);
            cb.clip();
            cb.newPath();

            img.setAbsolutePosition(x, y);
            cb.addImage(img);

            cb.restoreState();

            // Draw circular white border around avatar
            cb.setColorStroke(Color.WHITE);
            cb.setLineWidth(2f); // border ~2px
            cb.circle(xCenter, yCenter, radius);
            cb.stroke();

            // add some space after photo
            sidebar.setYLine(y - INNER_PAD); // gap equal to sidebar padding
        }

        sidebar.addElement(new Paragraph("CONTACT INFORMATION", whiteSmallCaps));
        sidebar.addElement(new Paragraph(contact.mobile != null ? contact.mobile : "", whiteNormal));
        sidebar.addElement(new Paragraph(contact.email != null ? contact.email : "", whiteNormal));
        if (contact.linkedIn != null && !contact.linkedIn.isBlank()) {
            sidebar.addElement(new Paragraph(contact.linkedIn, whiteNormal));
        }
        sidebar.addElement(new Paragraph(contact.location != null ? contact.location : "", whiteNormal));
        sidebar.addElement(Chunk.NEWLINE);

        // Education
        sidebar.addElement(new Paragraph("EDUCATION", whiteSmallCaps));
        for (int i = 0; i < educationList.size(); i++) {
            Education e = educationList.get(i);
            Paragraph p = new Paragraph(String.format("%s - %s\n%s\n%s\n%s\nGPA: %s", formatDate(e.startYear), formatDate(e.endYear), e.school, e.degree, e.field, e.gpa), whiteNormal);
            p.setSpacingAfter(7);
            sidebar.addElement(p);
        }

        // Add gap between Education and Skills
        sidebar.addElement(Chunk.NEWLINE);

        // Skills
        sidebar.addElement(new Paragraph("SKILLS", whiteSmallCaps));
        for (String s : skills) {
            Paragraph pSkill = new Paragraph();
            Chunk arrow = new Chunk("\u27A4", arrowFont);
            arrow.setTextRise(1f); // slightly raised, closer to vertical center
            pSkill.add(arrow);
            pSkill.add(new Chunk("  ", whiteNormal)); // wider gap between arrow and text
            pSkill.add(new Chunk(s, whiteNormal));
            sidebar.addElement(pSkill);
        }
        sidebar.addElement(Chunk.NEWLINE);

        // Tools
        sidebar.addElement(new Paragraph("TOOLS", whiteSmallCaps));
        for (String t : tools) {
            Paragraph pTool = new Paragraph();
            Chunk arrow = new Chunk("\u27A4", arrowFont);
            arrow.setTextRise(1f);
            pTool.add(arrow);
            pTool.add(new Chunk("  ", whiteNormal));
            pTool.add(new Chunk(t, whiteNormal));
            sidebar.addElement(pTool);
        }

        // ---- Main column will be paginated together with sidebar ----

        // ---------- Main column ----------
        ColumnText mainCol = new ColumnText(writer.getDirectContent());
        float TOP_PAD = INNER_PAD * 1.5f; // reduced top padding on first page
        mainCol.setSimpleColumn(doc.left() + sidebarWidth + INNER_PAD, doc.bottom() + INNER_PAD,
                doc.right() - INNER_PAD, doc.top() - TOP_PAD);

        Font nameFont = new Font(ARIAL_REGULAR_BF, 36, Font.NORMAL, Color.BLACK);
        Font sectionFont = new Font(ARIAL_MEDIUM_BF, 10, Font.NORMAL, new Color(0x3d, 0x52, 0x69));
        Font bodyFont = new Font(ARIAL_REGULAR_BF, 9, Font.NORMAL, Color.BLACK);
        Font itemTitleFont = new Font(ARIAL_BOLD_BF, 9, Font.NORMAL, Color.BLACK);

        mainCol.addElement(new Paragraph(firstName + " " + lastName, nameFont));
        mainCol.addElement(Chunk.NEWLINE);

        // Objective
        Paragraph objHead = new Paragraph("OBJECTIVE", sectionFont);
        objHead.setSpacingAfter(6);
        mainCol.addElement(objHead);
        // Colored line under heading
        LineSeparator lsObj = new LineSeparator();
        lsObj.setLineWidth(1f);
        lsObj.setLineColor(new Color(0x3d, 0x52, 0x69));
        mainCol.addElement(lsObj);

        Paragraph objPara = new Paragraph(objective, bodyFont);
        objPara.setSpacingAfter(10f);
        mainCol.addElement(objPara);

        // Experience
        Paragraph expHead = new Paragraph("EXPERIENCE", sectionFont);
        expHead.setSpacingAfter(6);
        mainCol.addElement(expHead);
        LineSeparator lsExp = new LineSeparator();
        lsExp.setLineWidth(1f);
        lsExp.setLineColor(new Color(0x3d, 0x52, 0x69));
        mainCol.addElement(lsExp);
        for (Experience ex : experienceList) {
            PdfPTable tbl = new PdfPTable(new float[]{70f, 30f});
            tbl.setWidthPercentage(100);
            tbl.getDefaultCell().setBorder(Rectangle.NO_BORDER);

            PdfPCell left = new PdfPCell(new Phrase(ex.title + " | " + ex.company, itemTitleFont));
            left.setBorder(Rectangle.NO_BORDER);

            PdfPCell right = new PdfPCell(new Phrase(ex.start + " - " + ex.end, bodyFont));
            right.setBorder(Rectangle.NO_BORDER);
            right.setHorizontalAlignment(Element.ALIGN_RIGHT);

            tbl.addCell(left);
            tbl.addCell(right);
            mainCol.addElement(tbl);

            Paragraph desc = new Paragraph(ex.description, bodyFont);
            desc.setIndentationLeft(10f);
            desc.setSpacingAfter(10f);
            mainCol.addElement(desc);
        }

        // Projects
        Paragraph projHead = new Paragraph("PROJECTS", sectionFont);
        projHead.setSpacingAfter(6);
        mainCol.addElement(projHead);
        LineSeparator lsProj = new LineSeparator();
        lsProj.setLineWidth(1f);
        lsProj.setLineColor(new Color(0x3d, 0x52, 0x69));
        mainCol.addElement(lsProj);
        for (Project pr : projectList) {
            PdfPTable tbl = new PdfPTable(new float[]{70f, 30f});
            tbl.setWidthPercentage(100);
            tbl.getDefaultCell().setBorder(Rectangle.NO_BORDER);

            PdfPCell left = new PdfPCell(new Phrase(pr.title, itemTitleFont));
            left.setBorder(Rectangle.NO_BORDER);

            PdfPCell right = new PdfPCell(new Phrase(pr.start + " - " + pr.end, bodyFont));
            right.setBorder(Rectangle.NO_BORDER);
            right.setHorizontalAlignment(Element.ALIGN_RIGHT);

            tbl.addCell(left);
            tbl.addCell(right);
            mainCol.addElement(tbl);

            Paragraph desc = new Paragraph(pr.description, bodyFont);
            desc.setIndentationLeft(10f);
            desc.setSpacingAfter(10f);
            mainCol.addElement(desc);
        }

        // Certifications
        Paragraph certHead = new Paragraph("CERTIFICATIONS", sectionFont);
        certHead.setSpacingAfter(6);
        mainCol.addElement(certHead);
        LineSeparator lsCert = new LineSeparator();
        lsCert.setLineWidth(1f);
        lsCert.setLineColor(new Color(0x3d, 0x52, 0x69));
        mainCol.addElement(lsCert);
        for (String c : certifications) {
            Paragraph pCert = new Paragraph();
            Chunk arrow = new Chunk("\u27A4", ARROW_FONT_BLACK);
            arrow.setTextRise(1f);
            pCert.add(arrow);
            pCert.add(new Chunk("  ", bodyFont));
            pCert.add(new Chunk(c, bodyFont));
            pCert.setSpacingAfter(2f);
            mainCol.addElement(pCert);
        }
        // Gap after Certifications list
        mainCol.addElement(Chunk.NEWLINE);

        // Achievements
        Paragraph achHead = new Paragraph("ACHIEVEMENTS", sectionFont);
        achHead.setSpacingBefore(10f);
        achHead.setSpacingAfter(6);
        mainCol.addElement(achHead);
        LineSeparator lsAch = new LineSeparator();
        lsAch.setLineWidth(1f);
        lsAch.setLineColor(new Color(0x3d, 0x52, 0x69));
        mainCol.addElement(lsAch);
        for (String a : achievements) {
            Paragraph pAch = new Paragraph();
            Chunk arrow = new Chunk("\u27A4", ARROW_FONT_BLACK);
            arrow.setTextRise(1f);
            pAch.add(arrow);
            pAch.add(new Chunk("  ", bodyFont));
            pAch.add(new Chunk(a, bodyFont));
            pAch.setSpacingAfter(2f);
            mainCol.addElement(pAch);
        }

        // ---- Unified pagination loop for BOTH columns ----
        int sbStatus, mcStatus;
        do {
            sbStatus = sidebar.go();
            mcStatus = mainCol.go();

            if (ColumnText.hasMoreText(sbStatus) || ColumnText.hasMoreText(mcStatus)) {
                doc.newPage();

                // Reset sidebar column for next page (avatar only on first page)
                sidebar.setSimpleColumn(doc.left() + INNER_PAD, doc.bottom() + INNER_PAD,
                        doc.left() + sidebarWidth - INNER_PAD, doc.top() - INNER_PAD);

                // Reset main column for next page with normal top padding
                mainCol.setSimpleColumn(doc.left() + sidebarWidth + INNER_PAD, doc.bottom() + INNER_PAD,
                        doc.right() - INNER_PAD, doc.top() - INNER_PAD);
            }
        } while (ColumnText.hasMoreText(sbStatus) || ColumnText.hasMoreText(mcStatus));

        doc.close();
        return baos.toByteArray();
    }

    /**
     * Convenience wrapper to build PDF directly from aggregated DTO.
     */
    public byte[] generateResumePdfFromDto(ResumeDto dto) throws Exception {
        return generateResumePdfFromDto(dto, null);
    }

    public byte[] generateResumePdfFromDto(ResumeDto dto, byte[] photoBytes) throws Exception {
        // Map DTO lists to internal classes used by PDF generator
        List<Education> edu = dto.educations == null ? List.of() : dto.educations.stream().map(e -> {
            Education ed = new Education();
            ed.startYear = e.startYear;
            ed.endYear = e.endYear;
            ed.school = e.school;
            ed.degree = e.degree;
            ed.field = e.field;
            ed.gpa = e.gpa;
            return ed;
        }).toList();

        List<Experience> exp = dto.experiences == null ? List.of() : dto.experiences.stream().map(x -> {
            Experience ex = new Experience();
            ex.title = x.title;
            ex.company = x.company;
            ex.start = formatDate(x.start);
            ex.end = formatDate(x.end);
            ex.description = x.description;
            return ex;
        }).toList();

        List<Project> proj = dto.projects == null ? List.of() : dto.projects.stream().map(p -> {
            Project pr = new Project();
            pr.title = p.title;
            pr.start = formatDate(p.start);
            pr.end = formatDate(p.end);
            pr.description = p.description;
            return pr;
        }).toList();

        return generateResumePdf(
                dto.firstName,
                dto.lastName,
                photoBytes,
                dto.objective,
                mapContact(resolveContact(dto)),
                edu,
                toStringList(dto.skills),
                toStringList(dto.tools),
                exp,
                proj,
                (dto.certifications == null ? java.util.List.of() : dto.certifications),
                (dto.achievements == null ? java.util.List.of() : dto.achievements)
        );
    }

    private ContactInfo mapContact(com.simtech.dto.resume.ContactInfoDto c) {
        ContactInfo ci = new ContactInfo();
        if (c != null) {
            ci.mobile = (c.mobile != null ? c.mobile : c.mobileNumber);
            ci.email = (c.email != null ? c.email : c.emailId);
            ci.location = (c.location != null ? c.location : c.state);
            ci.linkedIn = c.linkedIn;
        }
        return ci;
    }

    private com.simtech.dto.resume.ContactInfoDto resolveContact(ResumeDto dto) {
        if (dto.contact != null) return dto.contact;
        if (dto.contactInfoList != null && !dto.contactInfoList.isEmpty()) {
            return dto.contactInfoList.get(0);
        }
        return null;
    }

    private List<String> toStringList(List<SimpleTextDto> list) {
        if (list == null) return List.of();
        return list.stream()
                .map(st -> st == null ? null : st.text)
                .filter(s -> s != null && !s.isBlank())
                .collect(Collectors.toList());
    }

    private String formatDate(String input) {
        if (input == null || input.isBlank()) return "";
        try {
            if (input.contains("T")) {
                // Try parsing as instant first
                try {
                    Instant inst = Instant.parse(input);
                    ZonedDateTime zdt = inst.atZone(ZoneId.of("UTC"));
                    return zdt.format(DateTimeFormatter.ofPattern("MMM yyyy", Locale.ENGLISH));
                } catch (DateTimeParseException e) {
                    // Fall back to local date-time
                    LocalDateTime ldt = LocalDateTime.parse(input, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                    return ldt.format(DateTimeFormatter.ofPattern("MMM yyyy", Locale.ENGLISH));
                }
            } else if (input.matches("\\d{4}-\\d{2}-\\d{2}")) {
                LocalDate ld = LocalDate.parse(input, DateTimeFormatter.ISO_LOCAL_DATE);
                return ld.format(DateTimeFormatter.ofPattern("MMM yyyy", Locale.ENGLISH));
            }
        } catch (Exception ignored) {}
        return input; // return as-is if parsing fails
    }

    private static class SidebarEvent extends PdfPageEventHelper {
        private final Color sidebarColor = new Color(0x1d, 0x37, 0x52);
        private final float sidebarW = 178f;
        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfContentByte cb = writer.getDirectContentUnder();
            cb.setColorFill(sidebarColor);
            cb.rectangle(document.left(), document.bottom(), sidebarW, document.top() - document.bottom());
            cb.fill();
        }
    }

    // -------------------- Simple blank PDF ----------------------
    public byte[] generateBlankResumePdf() throws Exception {
        Document doc = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(doc, baos);
        writer.setPageEvent(new SidebarEvent());
        doc.setMargins(0, 0, 0, 0);
        doc.open();
        float imgHeight = 0f;
        float sidebarStartY = 0f;
        try {
            byte[] imgBytes = new org.springframework.core.io.ClassPathResource("images/dp-placeholder.jpg").getInputStream().readAllBytes();
            Image img = Image.getInstance(imgBytes);
            img.scaleToFit(120, 120); // avatar 120px

            float sidebarWidth = 178f;
            float INNER_PAD = 20f;
            float xCenter = INNER_PAD + (sidebarWidth - 2*INNER_PAD) / 2f; // center within sidebar
            float yTop = doc.top() - INNER_PAD;
            float yCenter = yTop - img.getScaledHeight() / 2f;
            float radius = img.getScaledWidth() / 2f;
            imgHeight = img.getScaledHeight();

            // compute bottom of avatar for later sidebar start
            float avatarBottom = yCenter - radius;
            sidebarStartY = avatarBottom - INNER_PAD;

            // We'll apply this startY after setting sidebar column

            PdfContentByte cb = writer.getDirectContent();
            cb.saveState();
            // Create circular clipping path
            cb.circle(xCenter, yCenter, radius);
            cb.clip();
            cb.newPath();

            img.setAbsolutePosition(xCenter - radius, yCenter - radius);
            cb.addImage(img);

            cb.restoreState();

            // Draw white circular border
            cb.setColorStroke(Color.WHITE);
            cb.setLineWidth(2f); // slimmer border ~3px
            cb.circle(xCenter, yCenter, radius);
            cb.stroke();
        } catch (Exception ignored) {}

        // ---------------- Sidebar content ------------------
        float sidebarWidth = 178f;
        float INNER_PAD = 20f;

        ColumnText sidebar = new ColumnText(writer.getDirectContent());

        // Column top starts just below avatar (or default top if avatar not found)
        float columnTop = (sidebarStartY > 0) ? sidebarStartY : doc.top() - INNER_PAD;

        sidebar.setSimpleColumn(doc.left() + INNER_PAD,               // left
                doc.bottom() + INNER_PAD,                             // bottom
                doc.left() + sidebarWidth - INNER_PAD,                // right
                columnTop);                                           // top

        // -------- Placeholder sidebar content (contact, education, skills, tools) --------
        Font whiteNormal = new Font(ARIAL_REGULAR_BF, 9, Font.NORMAL, Color.WHITE); // sidebar body text
        Font whiteSmallCaps = new Font(ARIAL_MEDIUM_BF, 10, Font.NORMAL, Color.WHITE); // section titles

        // Contact
        sidebar.addElement(new Paragraph("CONTACT INFORMATION", whiteSmallCaps));
        sidebar.addElement(new Paragraph("+91-0000000000", whiteNormal));
        sidebar.addElement(new Paragraph("user@example.com", whiteNormal));
        sidebar.addElement(new Paragraph("City, Country", whiteNormal));
        sidebar.addElement(Chunk.NEWLINE);

        // Education (placeholder with two items)
        sidebar.addElement(new Paragraph("EDUCATION", whiteSmallCaps));
        sidebar.addElement(new Paragraph("2020 - 2024\nExample University\nB.Tech in Computer Science", whiteNormal));
        sidebar.addElement(new Paragraph("2018 - 2020\nExample College\nPre-University", whiteNormal));
        sidebar.addElement(Chunk.NEWLINE);

        // Skills
        sidebar.addElement(new Paragraph("SKILLS", whiteSmallCaps));
        String[] tmpSkills = {"HTML", "CSS", "JavaScript"};
        for (String s : tmpSkills) {
            Paragraph p = new Paragraph();
            Chunk arrow = new Chunk("\u27A4", ARROW_FONT);
            arrow.setTextRise(1f);
            p.add(arrow);
            p.add(new Chunk("  " + s, whiteNormal));
            sidebar.addElement(p);
        }
        sidebar.addElement(Chunk.NEWLINE);

        // Tools
        sidebar.addElement(new Paragraph("TOOLS", whiteSmallCaps));
        String[] tmpTools = {"VS Code", "Git"};
        for (String t : tmpTools) {
            Paragraph p = new Paragraph();
            Chunk arrow = new Chunk("\u27A4", ARROW_FONT);
            arrow.setTextRise(1f);
            p.add(arrow);
            p.add(new Chunk("  " + t, whiteNormal));
            sidebar.addElement(p);
        }

        // ------------------------------------------------------------------------------

        // ---------------- Main content setup ----------------

        // Main content column setup
        float TOP_PAD_MAIN = INNER_PAD * 1.5f;
        float mainLeft = doc.left() + sidebarWidth + INNER_PAD;
        float mainRight = doc.right() - INNER_PAD;
        float mainTop = doc.top() - TOP_PAD_MAIN;

        ColumnText mainCol = new ColumnText(writer.getDirectContent());
        mainCol.setSimpleColumn(mainLeft, doc.bottom() + INNER_PAD, mainRight, mainTop);

        Font nameFont = new Font(ARIAL_REGULAR_BF, 36, Font.NORMAL, Color.BLACK);
        Font sectionFontMain = new Font(ARIAL_MEDIUM_BF, 10, Font.NORMAL, new Color(0x3d,0x52,0x69));
        Font bodyFontMain = new Font(ARIAL_REGULAR_BF, 9, Font.NORMAL, Color.BLACK);
        Font itemTitleFont = new Font(ARIAL_BOLD_BF, 9, Font.NORMAL, Color.BLACK);
        // Real bold weight from Arial Bold file
        // Font itemTitleFont = new Font(ARIAL_BOLD_BF, 9, Font.NORMAL, Color.BLACK);
        mainCol.addElement(new Paragraph("Manjesh R V", nameFont));
        mainCol.addElement(Chunk.NEWLINE);

        // Section heading: OBJECTIVE
        Paragraph objHeading = new Paragraph("OBJECTIVE", sectionFontMain);
        objHeading.setSpacingAfter(6);
        mainCol.addElement(objHeading);

        LineSeparator lsObj2 = new LineSeparator();
        lsObj2.setLineWidth(1f);
        lsObj2.setLineColor(new Color(0x3d,0x52,0x69));
        mainCol.addElement(lsObj2);

        // Objective paragraph text with 6pt gap after line
        String objText = "Full stack developer with hands-on experience in building responsive web applications using JavaScript, React, Node.js, and MongoDB. Skilled in developing scalable front-end and back-end systems, integrating APIs, and optimizing performance. Eager to contribute to dynamic teams, solve complex problems, and deliver user-focused digital solutions. Seeking a role where I can leverage my full stack skills to build impactful products.";
        Paragraph objParaBlank = new Paragraph(objText, new Font(Font.HELVETICA, 9, Font.NORMAL, Color.BLACK));
        mainCol.addElement(objParaBlank);

        // ================= EXPERIENCE SECTION =================
        // Spacer between sections

        Paragraph expHeading = new Paragraph("EXPERIENCE", sectionFontMain);
        expHeading.setSpacingAfter(6f);
        mainCol.addElement(expHeading);

        LineSeparator expLine = new LineSeparator();
        expLine.setLineWidth(1f);
        expLine.setLineColor(new Color(0x3d,0x52,0x69));
        mainCol.addElement(expLine);

        String[][] experiences = {
                {"Full Stack Developer", "Technova Solutions", "Jan 2021 - Mar 2023", "Developed and maintained full-stack web applications using React, Node.js, and PostgreSQL. Collaborated with UI/UX designers and backend teams to deliver scalable SaaS solutions. Implemented CI/CD pipelines and optimized application performance by 35%."},
                {"Full Stack Developer", "Pixelcraft Designs", "Jun 2020 - Dec 2022", "Designed and built responsive websites for small businesses using HTML, CSS, JavaScript, and React. Delivered over 15 client projects with a focus on SEO and mobile performance. Integrated CMS platforms and trained clients on content updates."},
                {"Backend Developer Intern", "Codewave Technologies", "Sep 2019 - Feb 2020", "Assisted in developing RESTful APIs using Express.js and MongoDB. Contributed to database schema design, bug fixing, and writing unit tests. Gained experience in agile workflows and Git version control."},
                {"Full Stack Engineer", "Byteworks Inc.", "Apr 2023 - Oct 2025", "Led the development of an internal employee portal using the MERN stack. Integrated third-party authentication (OAuth2), implemented role-based access control, and deployed the application on AWS. Reduced manual processes by 50%."},
                {"Web Developer", "Freelance", "Aug 2018 - May 2021", "Built and maintained websites for clients in the e-commerce, education, and healthcare industries using Laravel, Vue.js, and MySQL. Focused on performance, accessibility, and custom admin dashboards."}
        };

        for (String[] ex : experiences) {
            PdfPTable tbl = new PdfPTable(new float[]{70f, 30f});
            tbl.setWidthPercentage(100);
            tbl.getDefaultCell().setBorder(Rectangle.NO_BORDER);

            PdfPCell left = new PdfPCell(new Phrase(String.format("%s | %s", ex[0], ex[1]), itemTitleFont));
            left.setBorder(Rectangle.NO_BORDER);

            PdfPCell right = new PdfPCell(new Phrase(ex[2], bodyFontMain));
            right.setBorder(Rectangle.NO_BORDER);
            right.setHorizontalAlignment(Element.ALIGN_RIGHT);

            tbl.addCell(left);
            tbl.addCell(right);
            mainCol.addElement(tbl);

            Paragraph desc = new Paragraph(ex[3], bodyFontMain);
            desc.setIndentationLeft(10f);
            desc.setSpacingAfter(10f);
            mainCol.addElement(desc);
        }

        // ================= PROJECTS SECTION =================

        Paragraph projHeading = new Paragraph("PROJECTS", sectionFontMain);
        projHeading.setSpacingAfter(6f);
        mainCol.addElement(projHeading);

        LineSeparator projLine = new LineSeparator();
        projLine.setLineWidth(1f);
        projLine.setLineColor(new Color(0x3d,0x52,0x69));
        mainCol.addElement(projLine);

        String[][] projects = {
                {"EduCore – School ERP System", "Jan 2024 - Mar 2024", "Designed and developed a comprehensive ERP system for schools, enabling administrators to manage student records, attendance, assignments, and communication through a clean and responsive dashboard. Integrated LMS for online learning access."},
                {"NexTrend – AI-Powered Social Media Manager", "Apr 2024 - Jun 2024", "Built the UI and frontend architecture for an AI-based tool that suggests content, optimal posting times, and tracks growth metrics across multiple social media platforms."},
                {"Ozin – Restaurant Website with Reservation System", "Feb 2024 - Mar 2024", "Designed a full website for a high-end restaurant that emphasizes coal-cooked cuisine. Features included hero image carousel, private dining showcase, and a real-time table reservation form.control."},
                {"SkoolTalk – Community Platform for Students", "Sep 2023 - Dec 2023", "Developed a student-focused platform that allows users to share blogs, discuss coding problems, apply for internships, and build communities around tech stacks like HTML, React, and Node.js."},
                {"Akens Consulting – Agency Portfolio Website", "Jul 2023 - Aug 2023", "Designed and developed a multi-page portfolio website for a design and consulting agency based in Gabon. Pages included Services, Portfolio, Testimonials, Careers, and a Culture section."}
        };

        for (String[] pr : projects) {
            PdfPTable tbl = new PdfPTable(new float[]{70f, 30f});
            tbl.setWidthPercentage(100);
            tbl.getDefaultCell().setBorder(Rectangle.NO_BORDER);

            PdfPCell left = new PdfPCell(new Phrase(pr[0], itemTitleFont));
            left.setBorder(Rectangle.NO_BORDER);

            PdfPCell right = new PdfPCell(new Phrase(pr[1], bodyFontMain));
            right.setBorder(Rectangle.NO_BORDER);
            right.setHorizontalAlignment(Element.ALIGN_RIGHT);

            tbl.addCell(left);
            tbl.addCell(right);
            mainCol.addElement(tbl);

            Paragraph desc = new Paragraph(pr[2], bodyFontMain);
            desc.setIndentationLeft(10f);
            desc.setSpacingAfter(10f);
            mainCol.addElement(desc);
        }

        // Gap after Projects
        mainCol.addElement(Chunk.NEWLINE);

        // Certifications
        Paragraph certHeading = new Paragraph("CERTIFICATIONS", sectionFontMain);
        certHeading.setSpacingAfter(6f);
        mainCol.addElement(certHeading);
        LineSeparator certLine = new LineSeparator();
        certLine.setLineWidth(1f);
        certLine.setLineColor(new Color(0x3d,0x52,0x69));
        mainCol.addElement(certLine);

        String[] certs = {
                "UX Design – Google (Coursera)",
                "Front-End Development – Meta (Coursera)",
                "Web Development – freeCodeCamp",
                "Programming – freeCodeCamp",
                "Web Design / UI Development – Udemy"
        };
        for (String c : certs) {
            Paragraph pc = new Paragraph();
            Chunk arrow = new Chunk("\u27A4", ARROW_FONT_BLACK);
            arrow.setTextRise(1f);
            pc.add(arrow);
            pc.add(new Chunk("  ", bodyFontMain));
            pc.add(new Chunk(c, bodyFontMain));
            pc.setSpacingAfter(4f);
            mainCol.addElement(pc);
        }

        // ================= ACHIEVEMENTS SECTION =================

        Paragraph achHeading = new Paragraph("ACHIEVEMENTS", sectionFontMain);
        achHeading.setSpacingAfter(6f);
        mainCol.addElement(achHeading);
        LineSeparator achLine = new LineSeparator();
        achLine.setLineWidth(1f);
        achLine.setLineColor(new Color(0x3d,0x52,0x69));
        mainCol.addElement(achLine);

        String[] achievements = {
                "Successfully delivered custom websites for startups, restaurants, agencies, and SaaS products, helping clients improve online visibility and lead conversions.",
                "Redesigned key landing pages with conversion-focused UI, leading to measurable improvements in user engagement and sign-ups.",
                "Created a reusable component-based design system using Figma and Bootstrap for a mid-sized agency, reducing design-to-dev handoff time by 40%.",
                "Achieved consistent 5-star ratings for web design and front-end development services on Fiverr and Upwork, with repeat clients in multiple countries.",
                "Led the UI design and front-end development of a social media SaaS dashboard, contributing to a successful product launch and first 500+ trial sign-ups."
        };
        for (String a : achievements) {
            Paragraph pa = new Paragraph();
            Chunk arrow = new Chunk("\u27A4", ARROW_FONT_BLACK);
            arrow.setTextRise(1f);
            pa.add(arrow);
            pa.add(new Chunk("  ", bodyFontMain));
            pa.add(new Chunk(a, bodyFontMain));
            pa.setSpacingAfter(4f);
            mainCol.addElement(pa);
        }

        // ---- Unified pagination loop for BOTH columns ----
        int sbStatus2, mcStatus2;
        boolean firstPage = true;
        do {
            sbStatus2 = sidebar.go();
            mcStatus2 = mainCol.go();

            if (ColumnText.hasMoreText(sbStatus2) || ColumnText.hasMoreText(mcStatus2)) {
                doc.newPage();

                // Sidebar top for subsequent pages is full height (no avatar gap)
                sidebar.setSimpleColumn(doc.left() + INNER_PAD, doc.bottom() + INNER_PAD,
                        doc.left() + sidebarWidth - INNER_PAD, doc.top() - INNER_PAD);

                // Main column uses standard padding from page 2 onwards
                mainCol.setSimpleColumn(mainLeft, doc.bottom() + INNER_PAD,
                        mainRight, doc.top() - INNER_PAD);
                firstPage = false;
            }
        } while (ColumnText.hasMoreText(sbStatus2) || ColumnText.hasMoreText(mcStatus2));

        // Sidebar elements are already added earlier; pagination handled above.

        // Ensure at least one page exists
        if (doc.getPageNumber() == 0) {
            doc.add(new Paragraph(" "));
        }

        doc.close();
        return baos.toByteArray();
    }
} 