package com.simtech.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "PROG_STREAM_RLTNP")
public class ProgramStreamRelationship {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@ManyToOne
	@JoinColumn(name = "program_id", nullable = false)
//	@JsonIgnore
	private ProgramName programName;

	@ManyToOne
	@JoinColumn(name = "Strem_id", nullable = false)
	private Stream stream;

	@ManyToOne
	@JoinColumn(name = "org_id", nullable = false)
	@JsonIgnore
	private OrgDetail orgDetail;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public ProgramName getProgramName() {
		return programName;
	}

	public void setProgramName(ProgramName programName) {
		this.programName = programName;
	}

	public Stream getStream() {
		return stream;
	}

	public void setStream(Stream stream) {
		this.stream = stream;
	}

	public OrgDetail getOrgDetail() {
		return orgDetail;
	}

	public void setOrgDetail(OrgDetail orgDetail) {
		this.orgDetail = orgDetail;
	}

}
