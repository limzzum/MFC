DROP DATABASE IF EXISTS MFC;
CREATE DATABASE IF NOT EXISTS MFC;
USE MFC;

-- 테이블 생성
CREATE TABLE IF NOT EXISTS user (
                                    user_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                    email VARCHAR(30) NOT NULL UNIQUE,
                                    password VARCHAR(100) NOT NULL,
                                    nick_name VARCHAR(24) NOT NULL UNIQUE,
                                    profile VARCHAR(100),
                                    is_deleted BOOLEAN NOT NULL DEFAULT false,
                                    regist_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    item_code_id BIGINT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS talkroom (
                                        talkroom_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                        total_time INT NOT NULL,
                                        talk_time INT NOT NULL,
                                        max_people INT NOT NULL,
                                        cur_people INT NOT NULL DEFAULT 0,
                                        overtime_count INT NOT NULL,
                                        status VARCHAR(10) NOT NULL,
                                        a_topic VARCHAR(20) NOT NULL,
                                        b_topic VARCHAR(20) NOT NULL,
                                        start_time DATETIME,
                                        category_id BIGINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS category (
                                        category_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                        name VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS participant (
                                           participant_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                           nick_name VARCHAR(24) NOT NULL,
                                           is_vote_type_a BOOLEAN,
                                           is_host BOOLEAN NOT NULL DEFAULT false,
                                           vote_time DATETIME,
                                           enter_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                           user_id BIGINT NOT NULL,
                                           talkroom_id BIGINT NOT NULL,
                                           role_code_id BIGINT NOT NULL DEFAULT 3
);

CREATE TABLE IF NOT EXISTS player (
                                      player_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                      remain_overtime_count INT,
                                      heart_point INT NOT NULL,
                                      is_ready BOOLEAN NOT NULL DEFAULT false,
                                      is_topic_type_a BOOLEAN NOT NULL,
                                      talkroom_id BIGINT NOT NULL,
                                      user_id BIGINT
);

CREATE TABLE IF NOT EXISTS role_code (
                                         role_code_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                         role VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS history (
                                       history_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                       coin INT NOT NULL DEFAULT 0,
                                       experience INT NOT NULL DEFAULT 0,
                                       win_count INT NOT NULL DEFAULT 0,
                                       lose_count INT NOT NULL DEFAULT 0,
                                       draw_count INT NOT NULL DEFAULT 0,
                                       user_id BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS item_code (
                                         item_code_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                         name VARCHAR(10) NOT NULL,
                                         icon_name VARCHAR(20),
                                         comment VARCHAR(100) NOT NULL,
                                         price INT NOT NULL,
                                         rgb VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS used_item (
                                         used_item_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                         used_time DATETIME NOT NULL,
                                         item_code_id BIGINT NOT NULL,
                                         player_id BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_item (
                                         user_item_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                         count INT NOT NULL,
                                         item_code_id BIGINT NOT NULL,
                                         user_id BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS penalty_code (
                                            penalty_code_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                            name VARCHAR(20) NOT NULL,
                                            points INT NOT NULL
);

CREATE TABLE IF NOT EXISTS penalty_log (
                                           penalty_log_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                           penalty_time DATETIME NOT NULL,
                                           penalty_code_id BIGINT NOT NULL,
                                           user_id BIGINT NOT NULL
);

INSERT INTO penalty_code
(name, points)
VALUES
    ('비속어 사용', 1),
    ('자세 불량', 1),
    ('표정 불량', 1);

INSERT INTO item_code
(name, comment, price, rgb,icon_name)
VALUES
    ('검은색스프레이','닉네임을검은색으로변경합니다.',1000,'#121212','faSprayCan'),
    ('빨강색스프레이','닉네임을빨간색으로변경합니다.',1000,'#8B0000','faSprayCan'),
    ('초록색스프레이','닉네임을초록색으로변경합니다.',1000,'#008000','faSprayCan'),
    ('파랑색스프레이','닉네임을파랑색으로변경합니다.',1000,'#0000CD','faSprayCan'),
    ('보라색스프레이','닉네임을보라색으로변경합니다.',1000,'#8B008B','faSprayCan'),
    ('도저블루스프레이','닉네임을도저블루(스페셜)으로변경합니다.',5000,'#1E90FF','faSprayCan'),
    ('골덴로드스프레이','닉네임을골덴로드(스페셜)으로변경합니다.',5000,'#DAA520','faSprayCan');

INSERT INTO item_code
(name, comment, price,icon_name)
VALUES
    ('수호천사','HP가 1이 남았을 때, 패널티를 받게 되면 무효화 시켜줍니다.',50,'faCross'),
    ('포션','생명게이지 10을 회복시켜줍니다.(단, 잔여 HP가 90이상이면 사용이 불가능합니다)',100,'faHeartCirclePlus'),

    ('상대 음소거','다른 플레이어의 마이크가 5초동안 OFF 상태가 됩니다',150,'faVolumeXmark'),
    ('끼어들기','다른 플레이어의 발언 시간에 아이템을 사용한 플레이어의 마이크가 ON 상태가 됩니다.',100,'faHand');

INSERT INTO user
(email, nick_name, password, profile)
values
    ('kim@ssafy.com', '김싸피','123456789','test1'),
    ('lee@ssafy.com', '이싸피','123456789','test2'),
	('park@ssafy.com', '박싸피','123456789','test3'),
	('choi@ssafy.com', '최싸피','123456789','test4');

INSERT INTO category
(name)
VALUES
    ('자유'),
    ('스포츠');

INSERT INTO talkroom
(total_time, talk_time, max_people, cur_people, overtime_count, status, a_topic, b_topic, category_id)
VALUES (30,3,5,2,3,'ONGOING','물복','딱복',1);

INSERT INTO role_code
(role)
VALUES ('나간사람'),
       ('플레이어'),
       ('관전자');

