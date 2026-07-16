package com.simtech.controller;

import com.simtech.service.ResumePdfService;
import com.simtech.service.ResumePdfService.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(maxAge = 3600, origins = { "*" }, methods = { RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.PUT,
		RequestMethod.DELETE, RequestMethod.POST })
public class ResumeController {

    @Autowired
    private ResumePdfService resumePdfService;

    @GetMapping("/resume/sample")
    public ResponseEntity<byte[]> previewSampleResume() throws Exception {
        // --- Static data matching Tailwind mock-up ---
        String firstName = "Manjesh";
        String lastName = "R V";
        byte[] photoBytes = null;
        try {
            ClassPathResource res = new ClassPathResource("images/qcp-logo.png");
            photoBytes = res.getInputStream().readAllBytes();
        } catch (IOException ignored) {}

        String objective = "Full stack developer with hands-on experience in building responsive web applications using JavaScript, React, Node.js, and MongoDB. Skilled in developing scalable front-end and back-end systems, integrating APIs, and optimizing performance. Eager to contribute to dynamic teams, solve complex problems, and deliver user-focused digital solutions. Seeking a role where I can leverage my full stack skills to build impactful products.";

        ContactInfo contact = new ContactInfo();
        contact.mobile = "+91-9731400613";
        contact.email = "manjeshrv400@gmail.com";
        contact.location = "Andaman and Nicobar Islands";

        List<Education> education = Arrays.asList(
                edu("2001", "2003", "Basaveshwara Public School", "Primary", "All", "7"),
                edu("2003", "2007", "St Thomas Indian School", "Higher Primary", "All", "7"),
                edu("2007", "2010", "Sri Aurobindo Vidya Mandir", "Higher School", "All", "7"),
                edu("2010", "2012", "Sri Jagadguru Renukacharya College", "Pre-university", "PCMB", "7"),
                edu("2012", "2016", "Dr SMCE", "Bachelor Of Engineering", "Mechanical", "7")
        );

        List<String> skills = Arrays.asList("HTML", "CSS", "Javascript", "React JS", "Next JS", "Express JS");
        List<String> tools  = Arrays.asList("VS Code", "Github", "Git", "Postman", "Cursor", "Figma");

        List<Experience> experience = Arrays.asList(
                exp("Full Stack Developer", "Technova Solutions", "Jan 2021", "Mar 2023", "Developed and maintained full-stack web applications using React, Node.js, and PostgreSQL. Collaborated with UI/UX designers and backend teams to deliver scalable SaaS solutions. Implemented CI/CD pipelines and optimized application performance by 35%."),
                exp("Full Stack Developer", "Pixelcraft Designs", "Jun 2020", "Dec 2022", "Designed and built responsive websites for small businesses using HTML, CSS, JavaScript, and React. Delivered over 15 client projects with a focus on SEO and mobile performance. Integrated CMS platforms and trained clients on content updates."),
                exp("Backend Developer Intern", "Codewave Technologies", "Sep 2019", "Feb 2020", "Assisted in developing RESTful APIs using Express.js and MongoDB. Contributed to database schema design, bug fixing, and writing unit tests. Gained experience in agile workflows and Git version control."),
                exp("Full Stack Engineer", "Byteworks Inc.", "Apr 2023", "Oct 2025", "Led the development of an internal employee portal using the MERN stack. Integrated third-party authentication (OAuth2), implemented role-based access control, and deployed the application on AWS. Reduced manual processes by 50%."),
                exp("Web Developer", "Freelance", "Aug 2018", "May 2021", "Built and maintained websites for clients in the e-commerce, education, and healthcare industries. Used a combination of Laravel, Vue.js, and MySQL. Focused on performance, accessibility, and custom admin dashboards.")
        );

        List<Project> projects = Arrays.asList(
                proj("EduCore – School ERP System", "Jan 2024", "Mar 2024", "Designed and developed a comprehensive ERP system for schools, enabling administrators to manage student records, attendance, assignments, and communication through a clean and responsive dashboard. Integrated LMS for online learning access."),
                proj("NexTrend – AI-Powered Social Media Manager", "Apr 2024", "Jun 2024", "Built the UI and frontend architecture for an AI-based tool that suggests content, optimal posting times, and tracks growth metrics across multiple social media platforms."),
                proj("Ozin – Restaurant Website with Reservation System", "Feb 2024", "Mar 2024", "Designed a full website for a high-end restaurant that emphasizes coal-cooked cuisine. Features included hero image carousel, private dining showcase, and a real-time table reservation form.control."),
                proj("SkoolTalk – Community Platform for Students", "Sep 2023", "Dec 2023", "Developed a student-focused platform that allows users to share blogs, discuss coding problems, apply for internships, and build communities around tech stacks like HTML, React, and Node.js."),
                proj("Akens Consulting – Agency Portfolio Website", "Jul 2023", "Aug 2023", "Designed and developed a multi-page portfolio website for a design and consulting agency based in Gabon. Pages included Services, Portfolio, Testimonials, Careers, and a Culture section.")
        );

        List<String> certs = Arrays.asList(
                "UX Design – Google (Coursera)",
                "Front-End Development – Meta (Coursera)",
                "Web Development – freeCodeCamp",
                "Programming – freeCodeCamp",
                "Web Design / UI Development – Udemy"
        );

        List<String> achievements = Arrays.asList(
                "Successfully delivered custom websites for startups, restaurants, agencies, and SaaS products, helping clients improve online visibility and lead conversions.",
                "Redesigned key landing pages with conversion-focused UI, leading to measurable improvements in user engagement and sign-ups.",
                "Created a reusable component-based design system using Figma and Bootstrap for a mid-sized agency, reducing design-to-dev handoff time by 40%.",
                "Achieved consistent 5-star ratings for web design and front-end development services on Fiverr and Upwork, with repeat clients in multiple countries.",
                "Led the UI design and front-end development of a social media SaaS dashboard, contributing to a successful product launch and first 500+ trial sign-ups."
        );

        byte[] pdf = resumePdfService.generateBlankResumePdf();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=SampleResume.pdf")
                .body(pdf);
    }

    private static Education edu(String s, String e, String school, String degree, String field, String gpa) {
        Education ed = new Education();
        ed.startYear = s; ed.endYear = e; ed.school = school; ed.degree = degree; ed.field = field; ed.gpa = gpa; return ed;
    }

    private static Experience exp(String t, String c, String s, String e, String d){
        Experience ex = new Experience(); ex.title=t; ex.company=c; ex.start=s; ex.end=e; ex.description=d; return ex; }

    private static Project proj(String t,String s,String e,String d){ Project p=new Project(); p.title=t; p.start=s; p.end=e; p.description=d; return p; }
} 