CREATE DATABASE campusos;

USE campusos;

CREATE TABLE buildings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    address VARCHAR(255),
    floors INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    school VARCHAR(255),
    description TEXT,
    location VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department_id INT,
    designation VARCHAR(255),
    subjects TEXT,
    office_location VARCHAR(255),
    email VARCHAR(255),
    research_interests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE SET NULL
);

CREATE TABLE labs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department_id INT,
    building_id INT,
    floor INT,
    room_number VARCHAR(50),
    description TEXT,
    equipment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE SET NULL,

    FOREIGN KEY (building_id)
        REFERENCES buildings(id)
        ON DELETE SET NULL
);

CREATE TABLE facilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    building_id INT,
    location VARCHAR(255),
    timings VARCHAR(255),
    description TEXT,
    contact VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (building_id)
        REFERENCES buildings(id)
        ON DELETE SET NULL
);

CREATE TABLE offices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    purpose TEXT,
    building_id INT,
    location VARCHAR(255),
    timings VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    services TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (building_id)
        REFERENCES buildings(id)
        ON DELETE SET NULL
);

INSERT INTO buildings
(name, description, location, address, floors)
VALUES
(
    'Academic Block A',
    'Dummy academic building for CampusOS development.',
    'Main Campus',
    'MIT-WPU Campus, Pune',
    4
);

INSERT INTO buildings
(name, description, location, address, floors)
VALUES
(
    'Academic Block B',
    'Dummy academic building for CampusOS development.',
    'Main Campus',
    'MIT-WPU Campus, Pune',
    5
),
(
    'Central Library Building',
    'Dummy library building for CampusOS development.',
    'Main Campus',
    'MIT-WPU Campus, Pune',
    3
);

INSERT INTO departments
(name, school, description, location, contact_email)
VALUES
(
    'Electronics Engineering',
    'School of Engineering',
    'Dummy department for CampusOS development.',
    'Academic Block A',
    'electronics@example.com'
),
(
    'Computer Engineering',
    'School of Engineering',
    'Dummy department for CampusOS development.',
    'Academic Block B',
    'computer@example.com'
),
(
    'Artificial Intelligence and Machine Learning',
    'School of Engineering',
    'Dummy department for CampusOS development.',
    'Academic Block B',
    'aiml@example.com'
);


INSERT INTO faculty
(name, department_id, designation, subjects, office_location, email, research_interests)
VALUES
(
    'Dr. Aarav Mehta',
    1,
    'Assistant Professor',
    'Digital Electronics, Embedded Systems',
    'Academic Block A, Room 301',
    'aarav@example.com',
    'Embedded Systems, IoT'
),
(
    'Dr. Riya Sharma',
    2,
    'Associate Professor',
    'Data Structures, Algorithms',
    'Academic Block B, Room 402',
    'riya@example.com',
    'Algorithms, Distributed Systems'
),
(
    'Dr. Karan Shah',
    3,
    'Assistant Professor',
    'Machine Learning, Deep Learning',
    'Academic Block B, Room 305',
    'karan@example.com',
    'Machine Learning, Computer Vision'
);

INSERT INTO labs
(name, department_id, building_id, floor, room_number, description, equipment)
VALUES
(
    'Electronics Laboratory',
    1,
    1,
    2,
    '204',
    'Dummy electronics laboratory for CampusOS development.',
    'Oscilloscopes, Function Generators, Power Supplies'
),
(
    'Computer Networks Laboratory',
    2,
    2,
    3,
    '305',
    'Dummy computer networking laboratory for CampusOS development.',
    'Network Switches, Routers, PCs'
),
(
    'Artificial Intelligence Laboratory',
    3,
    2,
    4,
    '401',
    'Dummy AI and machine learning laboratory for CampusOS development.',
    'GPU Workstations, Development PCs'
);

INSERT INTO facilities
(name, category, building_id, location, timings, description, contact)
VALUES
(
    'Central Library',
    'Library',
    3,
    'Central Library Building',
    '8:00 AM - 10:00 PM',
    'Dummy library facility for CampusOS development.',
    'library@example.com'
),
(
    'Campus Cafeteria',
    'Food',
    1,
    'Academic Block A, Ground Floor',
    '8:00 AM - 8:00 PM',
    'Dummy cafeteria facility for CampusOS development.',
    'cafeteria@example.com'
),
(
    'Medical Centre',
    'Healthcare',
    1,
    'Academic Block A, Ground Floor',
    '9:00 AM - 5:00 PM',
    'Dummy medical facility for CampusOS development.',
    'medical@example.com'
);

INSERT INTO offices
(name, purpose, building_id, location, timings, contact_email, services)
VALUES
(
    'Admissions Office',
    'Handles admission-related enquiries and processes.',
    1,
    'Academic Block A, Ground Floor',
    '10:00 AM - 5:00 PM',
    'admissions@example.com',
    'Admission enquiries, document verification'
),
(
    'Examination Office',
    'Handles examination-related academic administration.',
    2,
    'Academic Block B, Ground Floor',
    '10:00 AM - 5:00 PM',
    'exams@example.com',
    'Exam forms, examination enquiries'
),
(
    'Student Affairs Office',
    'Handles student-related administrative services.',
    2,
    'Academic Block B, Ground Floor',
    '10:00 AM - 5:00 PM',
    'studentaffairs@example.com',
    'Student support and administrative enquiries'
);


