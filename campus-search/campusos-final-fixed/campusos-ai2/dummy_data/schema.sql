-- CampusOS dummy database schema (MIT-WPU)
-- This mirrors the schema described in the project brief.
-- In production this file is NOT run automatically — it exists only to let
-- this module be developed/tested against a realistic dummy dataset.

USE campusos;

DROP TABLE IF EXISTS offices;
DROP TABLE IF EXISTS facilities;
DROP TABLE IF EXISTS labs;
DROP TABLE IF EXISTS faculty;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS buildings;

CREATE TABLE buildings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    floors INT
);

CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    school VARCHAR(150),
    description TEXT
);

CREATE TABLE faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    designation VARCHAR(100),
    department_id INT,
    email VARCHAR(150),
    subjects_taught TEXT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE labs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    department_id INT,
    building_id INT,
    floor VARCHAR(20),
    room_number VARCHAR(20),
    equipment TEXT,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (building_id) REFERENCES buildings(id)
);

CREATE TABLE facilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    building_id INT,
    floor VARCHAR(20),
    timings VARCHAR(150),
    description TEXT,
    FOREIGN KEY (building_id) REFERENCES buildings(id)
);

CREATE TABLE offices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    building_id INT,
    floor VARCHAR(20),
    room_number VARCHAR(20),
    handles TEXT,
    contact VARCHAR(100),
    FOREIGN KEY (building_id) REFERENCES buildings(id)
);
