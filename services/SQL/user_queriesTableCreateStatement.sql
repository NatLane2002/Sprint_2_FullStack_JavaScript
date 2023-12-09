CREATE TABLE user_queries (
    query_id SERIAL PRIMARY KEY,
    user_id INT,
    keyword VARCHAR(255),
    datetime_stamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
