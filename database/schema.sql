-- InteliVoucher Trip System Database Schema
-- Simple MySQL database for event ticketing system
-- Updated to support dynamic zone pricing and availability
-- 
-- Key Features:
-- - Event zones with individual pricing and availability
-- - Zone-based booking and ticket management
-- - Capacity tracking per zone
-- - Flexible pricing structure

CREATE DATABASE IF NOT EXISTS intelivoucher;
USE intelivoucher;

-- Categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(10) NOT NULL,
    color VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Venues table
CREATE TABLE venues (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50),
    country VARCHAR(100) NOT NULL DEFAULT 'USA',
    capacity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table (main trips/events)
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    venue_id INT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    price_from DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    rating DECIMAL(2,1) DEFAULT 0,
    is_sold_out BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    includes_transportation BOOLEAN DEFAULT FALSE,
    is_presale BOOLEAN DEFAULT FALSE,
    requires_ticket_acquisition BOOLEAN DEFAULT FALSE,
    refundable_if_no_ticket BOOLEAN DEFAULT FALSE,
    accepts_under_age BOOLEAN DEFAULT TRUE,
    jersey_addon_available BOOLEAN DEFAULT FALSE,
    jersey_price DECIMAL(10,2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (venue_id) REFERENCES venues(id),
    INDEX idx_event_date (event_date),
    INDEX idx_category (category_id),
    INDEX idx_trending (is_trending),
    INDEX idx_presale (is_presale)
);

-- Event zones table (seating/price zones for each event)
CREATE TABLE event_zones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    zone_name VARCHAR(100) NOT NULL,
    zone_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    capacity INT,
    available_seats INT,
    is_available BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_event_zones (event_id),
    INDEX idx_zone_availability (is_available),
    UNIQUE KEY unique_event_zone_name (event_id, zone_name)
);

-- Payment options for events
CREATE TABLE event_payment_options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    installments_available BOOLEAN DEFAULT FALSE,
    presale_deposit_available BOOLEAN DEFAULT FALSE,
    second_payment_installments_available BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Gifts included with events
CREATE TABLE event_gifts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    gift_name VARCHAR(255) NOT NULL,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    is_under_age BOOLEAN GENERATED ALWAYS AS (DATEDIFF(CURDATE(), date_of_birth) < 6570) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email)
);

-- Bookings/Orders table
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    zone_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status ENUM('pending', 'confirmed', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'partial', 'refunded') DEFAULT 'pending',
    payment_method ENUM('credit_card', 'debit_card', 'paypal', 'installments') NOT NULL,
    includes_jersey BOOLEAN DEFAULT FALSE,
    jersey_size VARCHAR(10) NULL,
    special_requests TEXT,
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (zone_id) REFERENCES event_zones(id),
    INDEX idx_user_bookings (user_id),
    INDEX idx_event_bookings (event_id),
    INDEX idx_booking_reference (booking_reference),
    INDEX idx_booking_status (booking_status)
);

-- Tickets table (individual tickets within a booking)
CREATE TABLE tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    zone_id INT NOT NULL,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    attendee_name VARCHAR(200),
    ticket_status ENUM('active', 'used', 'cancelled', 'transferred') DEFAULT 'active',
    qr_code VARCHAR(255),
    seat_section VARCHAR(10),
    seat_row VARCHAR(10),
    seat_number VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (zone_id) REFERENCES event_zones(id),
    INDEX idx_ticket_number (ticket_number),
    INDEX idx_booking_tickets (booking_id)
);

-- Payment installments table
CREATE TABLE payment_installments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    installment_number INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date TIMESTAMP NULL,
    payment_status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking_installments (booking_id),
    INDEX idx_due_date (due_date)
);

-- Reviews table
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    booking_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    UNIQUE KEY unique_user_event_review (user_id, event_id),
    INDEX idx_event_reviews (event_id)
);

-- Trigger to update event rating when new reviews are added
DELIMITER //
CREATE TRIGGER update_event_rating 
AFTER INSERT ON reviews 
FOR EACH ROW
BEGIN
    UPDATE events 
    SET rating = (
        SELECT ROUND(AVG(rating), 1) 
        FROM reviews 
        WHERE event_id = NEW.event_id
    ) 
    WHERE id = NEW.event_id;
END//
DELIMITER ;