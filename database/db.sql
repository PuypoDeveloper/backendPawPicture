
CREATE DATABASE database_login

use database_login; 

--table users

CREATE TABLE users ( 
    id INT NOT NULL AUTO_INCREMENT primary key, 
    username VARCHAR(20) NOT NULL, 
    password VARCHAR(60) NOT NULL, 
    fullname VARCHAR(100) NOT NULL
);

--table links

CREATE TABLE links (
    id INT NOT NULL primary key,
    _description text, ,
    user_id INT,
    created_att timestamp NOT NULL DEFAULT current_timestamp
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TALBE links
MODIFY id INT NOT NULL AUTO_INCREMENT primary key
