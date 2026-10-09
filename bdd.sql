CREATE DATABASE eventhub;

use eventhub;

CREATE USER 'eventhub'@'%' IDENTIFIED BY 'eventhub';

GRANT SELECT,UPDATE,INSERT,DELETE ON eventhub.* TO 'eventhub'@'%';

FLUSH PRIVILEGES;

CREATE TABLE users (
us_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
us_username VARCHAR(255) NOT NULL UNIQUE,
us_password TEXT NOT NULL,
us_email VARCHAR(255) NOT NULL UNIQUE)
ENGINE=InnoDB;

CREATE TABLE events(
ev_id INt NOT NULL AUTO_INCREMENT PRIMARY KEY,
ev_title VARCHAR(255) NOT NULL,
ev_description TEXT,
ev_date DATE,
ev_location VARCHAR(255),
ev_owner INT,
CONSTRAINT ev_owner FOREIGN KEY (ev_owner) REFERENCES users(us_id) )
ENGINE=InnoDB;

CREATE TABLE comments (
co_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
co_comment TEXT NOT NULL,
co_user INT,
co_event INT,
CONSTRAINT co_user FOREIGN KEY (co_user) REFERENCES users(us_id),
CONSTRAINT co_event FOREIGN KEY (co_event) REFERENCES events(ev_id) )
ENGINE=InnoDB;

CREATE TABLE participants (
pa_user INT,
pa_event INT,
PRIMARY KEY (pa_user,pa_event),
FOREIGN KEY (pa_user) REFERENCES users(us_id),
FOREIGN KEY (pa_event) REFERENCES events(ev_id) ) 
ENGINE=InnoDB;