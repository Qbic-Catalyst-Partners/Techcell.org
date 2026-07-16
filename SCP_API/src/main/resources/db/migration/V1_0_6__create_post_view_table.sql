CREATE TABLE post_view (
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, user_id),
    CONSTRAINT fk_post_view_post FOREIGN KEY (post_id) REFERENCES posting(id),
    CONSTRAINT fk_post_view_user FOREIGN KEY (user_id) REFERENCES user_detail(user_id)
); 