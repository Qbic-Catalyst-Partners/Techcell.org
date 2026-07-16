package com.simtech.dto.resume;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.simtech.dto.resume.SimpleTextDto;

import com.fasterxml.jackson.annotation.JsonAlias;

public class ResumeDto {
    public String firstName;
    public String lastName;
    public String objective;

    public ContactInfoDto contact;
    @JsonProperty("Contact Info")
    @JsonAlias({"contactInfo"})
    public java.util.List<ContactInfoDto> contactInfoList;

    public List<EducationDto> educations;
    @JsonProperty("Edcuation")
    public void setEducations(List<EducationDto> list){ this.educations = list; }
    public List<SimpleTextDto> skills;
    @JsonAlias({"skills"})
    @JsonProperty("Tools")
    public List<SimpleTextDto> tools;
    public List<ExperienceDto> experiences;
    @JsonProperty("Experience")
    public void setExperiences(List<ExperienceDto> list){ this.experiences = list; }
    public List<ProjectDto> projects;
    @JsonProperty("Project")
    public void setProjects(List<ProjectDto> list){ this.projects = list; }
    public List<String> certifications;
    @JsonProperty("Certification")
    public void setCertifications(List<Object> list){
        if(list == null){ this.certifications = null; return; }
        this.certifications = list.stream().map(o -> {
            if(o instanceof String) return (String)o;
            try {
                java.util.Map m = (java.util.Map) o;
                Object val = m.getOrDefault("certifyingEntity", m.getOrDefault("field", ""));
                return val != null ? val.toString() : "";
            } catch (Exception ex){
                return o.toString();
            }
        }).toList();
    }
    public List<String> achievements;
    @JsonProperty("Achievements")
    public void setAchievements(List<Object> list){
        if(list == null){ this.achievements = null; return; }
        this.achievements = list.stream().map(o -> {
            if(o instanceof String) return (String)o;
            try {
                java.util.Map m = (java.util.Map) o;
                Object val = m.getOrDefault("description", "");
                return val != null ? val.toString() : "";
            } catch (Exception ex){
                return o.toString();
            }
        }).toList();
    }
} 