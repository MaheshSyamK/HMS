-- Create database
CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;

-- USERS Table (Admin, Doctor, FrontDesk, DataEntry)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'frontdesk', 'dataentry') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DOCTORS Table
CREATE TABLE doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- PATIENTS Table
CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    age INT NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) UNIQUE,
    address VARCHAR(255),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FRONTDESK Table
CREATE TABLE frontdesk (
    frontdesk_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    phone VARCHAR(15) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- DATAENTRY Table
CREATE TABLE dataentry (
    dataentry_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    phone VARCHAR(15),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ROOMS Table
CREATE TABLE rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL UNIQUE,
    type ENUM('General', 'ICU', 'Private') NOT NULL,
    capacity INT NOT NULL,
    occupied BOOLEAN DEFAULT FALSE
);

CREATE TABLE admissions (
    admission_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    room_id INT NOT NULL,
    admitted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    discharge_date DATETIME,
    status ENUM('admitted', 'discharged') DEFAULT 'admitted',
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);


-- APPOINTMENTS Table
CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_time DATETIME NOT NULL,
    status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
);

-- TESTS Table
CREATE TABLE tests (
    test_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    test_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    result TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

-- TREATMENTS Table
CREATE TABLE treatments (
    treatment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    description TEXT NOT NULL,
    treatment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
);

-- PRESCRIPTIONS Table
CREATE TABLE prescriptions (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    medicine TEXT NOT NULL,
    dosage TEXT NOT NULL,
	is_prescribed BOOLEAN DEFAULT FALSE,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
);

-- INSERTING DATA

-- Insert Users
INSERT INTO users (name, email, password, role) VALUES
('Admin One', 'admin1@hospital.com', 'admin@123', 'admin'),
('Dr. Shalini Rao', 'shalini@hospital.com', 'doc@123', 'doctor'),
('Front Desk Operator', 'frontdesk@hospital.com', 'front@123', 'frontdesk'),
('Data Entry Operator', 'dataentry@hospital.com', 'data@123', 'dataentry');

-- Insert Doctors (Dr. Shalini Rao is user_id = 2)
INSERT INTO doctors (user_id, specialization, phone) VALUES
(2, 'Cardiology', '9876543210');

-- Insert Patients
INSERT INTO patients (name, gender, age, phone, email, address) VALUES
('Ravi Kumar', 'Male', 45, '9123456780', 'ravi@gmail.com', 'Hyderabad'),
('Sita Devi', 'Female', 30, '9234567891', 'sita@gmail.com', 'Bhubaneswar'),
('Anil Mehta', 'Male', 52, '9345678902', 'anil@gmail.com', 'Mumbai');

-- Insert Rooms
INSERT INTO rooms (room_number, type, capacity, occupied) 
VALUES 
('305', 'Private', 2, FALSE),
('306', 'Private', 2, FALSE),
('307', 'Private', 2, FALSE),
('401', 'General', 4, FALSE),
('402', 'General', 4, FALSE),
('403', 'General', 4, FALSE),
('404', 'General', 4, FALSE),
('405', 'General', 4, FALSE);



-- Insert Admissions (assume patient_id = 1 and room_id = 1)
INSERT INTO admissions (patient_id, room_id) VALUES
(1, 1);

-- Insert Appointments (assume doctor_id = 1)
INSERT INTO appointments (patient_id, doctor_id, appointment_time) VALUES
(2, 1, '2025-04-10 10:00:00'),
(3, 1, '2025-04-10 11:00:00');

-- Insert Tests
INSERT INTO tests (patient_id, test_name, test_date, result) VALUES
(2, 'Blood Test', '2025-04-08 09:30:00', 'Normal'),
(3, 'ECG', '2025-04-08 10:00:00', 'Abnormal');

-- Insert Treatments
INSERT INTO treatments (patient_id, doctor_id, description, treatment_date) VALUES
(2, 1, 'Hypertension Management', '2025-04-08 10:30:00'),
(3, 1, 'Chest Pain Evaluation', '2025-04-08 11:15:00');

-- Insert Prescriptions
INSERT INTO prescriptions (patient_id, doctor_id, medicine, dosage) VALUES
(2, 1, 'Amlodipine', '5mg daily	'),
(3, 1, 'Nitroglycerin', 'As needed');
