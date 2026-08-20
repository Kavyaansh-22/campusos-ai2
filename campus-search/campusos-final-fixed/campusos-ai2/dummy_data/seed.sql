USE campusos;

INSERT INTO buildings (name, description, floors) VALUES
('Academic Block A', 'Main academic building housing Computer Engineering and Electronics departments.', 5),
('Academic Block B', 'Academic building housing AI/ML, Data Science and Mechanical departments.', 4),
('Central Library Building', 'Houses the Central Library and reading halls.', 3),
('Administration Building', 'Houses admissions, examination and administrative offices.', 2);

INSERT INTO departments (name, school, description) VALUES
('Computer Engineering', 'School of Engineering', 'Focuses on software systems, algorithms, and computer architecture.'),
('Electronics Engineering', 'School of Engineering', 'Focuses on electronic circuits, embedded systems, and communication.'),
('Artificial Intelligence & Machine Learning', 'School of Engineering', 'Focuses on AI, ML, deep learning and data-driven systems.'),
('Mechanical Engineering', 'School of Engineering', 'Focuses on thermodynamics, design, and manufacturing.');

INSERT INTO faculty (name, designation, department_id, email, subjects_taught) VALUES
('Dr. Karan Shah', 'Associate Professor', 2, 'karan.shah@mitwpu.edu.in', 'Digital Electronics, Embedded Systems'),
('Dr. Anjali Mehta', 'Professor', 3, 'anjali.mehta@mitwpu.edu.in', 'Machine Learning, Deep Learning'),
('Dr. Rohit Verma', 'Assistant Professor', 1, 'rohit.verma@mitwpu.edu.in', 'Data Structures, Operating Systems'),
('Dr. Sneha Kulkarni', 'Professor', 3, 'sneha.kulkarni@mitwpu.edu.in', 'Machine Learning, Neural Networks'),
('Dr. Prakash Iyer', 'Associate Professor', 4, 'prakash.iyer@mitwpu.edu.in', 'Thermodynamics, Fluid Mechanics');

INSERT INTO labs (name, department_id, building_id, floor, room_number, equipment) VALUES
('Electronics Laboratory', 2, 1, '2nd floor', '204', 'Oscilloscopes, function generators, breadboards, soldering stations'),
('Computer Networks Laboratory', 1, 1, '3rd floor', '301', 'Cisco routers, switches, network simulators'),
('AI Laboratory', 3, 2, '4th floor', '401', 'GPU workstations, NVIDIA RTX servers, robotics kits'),
('Mechanical Workshop Lab', 4, 2, 'Ground floor', 'G05', 'Lathe machines, 3D printers, CNC machine');

INSERT INTO facilities (name, building_id, floor, timings, description) VALUES
('Central Library', 3, 'Ground & 1st floor', '8:00 AM - 8:00 PM', 'Central library with reading halls, digital resources, and book lending.'),
('Cafeteria', 1, 'Ground floor', '8:00 AM - 6:00 PM', 'Main student cafeteria serving breakfast, lunch and snacks.'),
('Sports Complex', 4, 'Ground floor', '6:00 AM - 9:00 PM', 'Indoor sports facility with badminton and table tennis courts.');

INSERT INTO offices (name, building_id, floor, room_number, handles, contact) VALUES
('Admissions Office', 4, 'Ground floor', '101', 'New admissions, application queries, document verification', 'admissions@mitwpu.edu.in'),
('Examination Office', 4, '1st floor', '201', 'Exam scheduling, hall tickets, results, revaluation requests', 'exams@mitwpu.edu.in'),
('Accounts Office', 4, 'Ground floor', '105', 'Fee payments, refunds, scholarship disbursement', 'accounts@mitwpu.edu.in');
