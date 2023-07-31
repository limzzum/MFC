CREATE DATABASE IF NOT EXISTS MFC;
USE MFC;

-- 테이블 생성
CREATE TABLE user (
	user_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    nick_name VARCHAR(24) NOT NULL UNIQUE,
    proflie VARCHAR(100),
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    regist_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    item_code_id BIGINT NOT NULL
);

CREATE TABLE talkroom (
	talkroom_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tatal_time INT NOT NULL,
    talk_time INT NOT NULL,
    max_people INT NOT NULL,
    cur_people INT NOT NULL DEFAULT 0,
    overtime_count INT NOT NULL,
    status VARCHAR(10) NOT NULL,
    a_topic VARCHAR(20) NOT NULL,
    b_topic VARCHAR(20) NOT NULL,
    start_time DATETIME,
    category_id BIGINT NOT NULL
);

CREATE TABLE category (
	category_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(10) NOT NULL
);

CREATE TABLE participant (
	participant_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nick_name VARCHAR(24) NOT NULL,
    is_vote_type_a BOOLEAN,
    is_host BOOLEAN NOT NULL DEFAULT false,
    vote_time DATETIME,
    enter_time DATETIME NOT NULL,
    user_id BIGINT NOT NULL,
    talkroom_id BIGINT NOT NULL,
    role_code_id BIGINT NOT NULL
);

CREATE TABLE player (
	player_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    remain_overtime_count INT,
    heart_point INT NOT NULL,
    is_ready BOOLEAN NOT NULL DEFAULT false,
    is_topic_type_a BOOLEAN NOT NULL,
    talkroom_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL
);

CREATE TABLE role_code (
	role_code_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(10) NOT NULL
);

CREATE TABLE history (
	history_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    coin INT NOT NULL DEFAULT 0,
    experience INT NOT NULL DEFAULT 0,
    win_count INT NOT NULL DEFAULT 0,
    lose_count INT NOT NULL DEFAULT 0,
    draw_count INT NOT NULL DEFAULT 0,
    user_id BIGINT NOT NULL
);

CREATE TABLE item_code (
	item_code_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(10) NOT NULL,
    comment VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    rgb VARCHAR(10)
);

CREATE TABLE used_item (
	used_item_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    used_time DATETIME NOT NULL,
    item_code_id BIGINT NOT NULL,
    player_id BIGINT NOT NULL
);

CREATE TABLE user_item (
	user_item_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    count INT NOT NULL,
    item_code_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL
);

CREATE TABLE penalty_code (
	penalty_code_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    points INT NOT NULL
);

CREATE TABLE penalty_log (
	penalty_log_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    penalty_time DATETIME NOT NULL,
    penalty_code_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL
);
     
-- 테이블 정보 확인
DESC user;

-- 전체 테이블 데이터 조회
SELECT * From user;