package com.simtech.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.ProgramName;

@Repository
public interface ProgrameNameRepository extends JpaRepository<ProgramName, Long> {
//	List<ProgramName> findByProgramCodeIn(List<String> programCode);
	ProgramName findByProgramCode(String programCode);
}