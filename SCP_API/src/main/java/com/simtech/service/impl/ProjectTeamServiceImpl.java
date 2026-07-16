package com.simtech.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.simtech.dao.ProjectTeamRepository;
import com.simtech.entity.ProjectTeam;
import com.simtech.service.ProjectTeamService;

@Service
public class ProjectTeamServiceImpl implements ProjectTeamService {

    @Autowired
    private ProjectTeamRepository projectTeamRepository;

    @Override
    @Transactional
    public ProjectTeam createTeam(ProjectTeam team) {
        return projectTeamRepository.save(team);
    }
} 