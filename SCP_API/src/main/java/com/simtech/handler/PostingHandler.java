package com.simtech.handler;

import com.simtech.entity.Posting;

public interface PostingHandler<T> {

	void validate(Posting posting, T post);

	void beforeProcess(Posting posting, T post);

	void afterProcess(Posting posting, T post);

}
