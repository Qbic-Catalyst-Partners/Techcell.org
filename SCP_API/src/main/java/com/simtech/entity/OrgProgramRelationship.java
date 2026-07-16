package com.simtech.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "ORG_PROG_RLTNP")
public class OrgProgramRelationship {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@ManyToOne
	@JoinColumn(name = "org_id", nullable = false)
//	@JsonIgnore
	private OrgDetail orgDetail;

	@ManyToOne
	@JoinColumn(name = "program_id", nullable = false)
	private ProgramName program;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public OrgDetail getOrgDetail() {
		return orgDetail;
	}

	public void setOrgDetail(OrgDetail orgDetail) {
		this.orgDetail = orgDetail;
	}

	public ProgramName getProgram() {
		return program;
	}

	public void setProgram(ProgramName program) {
		this.program = program;
	}

}
