package com.simtech.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class SecurityQuestion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "question_id")
	private Long questionId;

	private String questiondesc;

	public Long getQuestionId() {
		return questionId;
	}

	public void setQuestionId(Long questionId) {
		this.questionId = questionId;
	}

	public String getQuestiondesc() {
		return questiondesc;
	}

	public void setQuestiondesc(String questiondesc) {
		this.questiondesc = questiondesc;
	}

	public SecurityQuestion(Long questionId) {
		super();
		this.questionId = questionId;
	}

	public SecurityQuestion() {
		super();
	}

}
