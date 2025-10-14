-- InteliVoucher Trip System Database Schema
-- Simple MySQL database for event ticketing system
-- Updated to support dynamic zone pricing and availability
-- 
-- Key Features:
-- - Event zones with individual pricing and availability
-- - Zone-based booking and ticket management
-- - Capacity tracking per zone
-- - Flexible pricing structure

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

-- Transportation types table
CREATE TABLE transportation_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_code VARCHAR(20) NOT NULL UNIQUE,
    type_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table (main trips/events) - matches Trip interface
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    venue_id INT NOT NULL,
    description TEXT,
    event_details_html LONGTEXT, -- HTML content for detailed event overview
    event_date DATE NOT NULL,
    event_time TIME,
    
    -- Location info (can be different from venue for trips)
    location VARCHAR(255) NOT NULL,
    
    -- Media
    image_url VARCHAR(500),
    
    -- Rating and status
    rating DECIMAL(2,1) DEFAULT 0,
    is_sold_out BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    
    -- Trip/Event features
    includes_transportation BOOLEAN DEFAULT FALSE,
    is_presale BOOLEAN DEFAULT FALSE,
    requires_ticket_acquisition BOOLEAN DEFAULT FALSE,
    refundable_if_no_ticket BOOLEAN DEFAULT FALSE,
    accepts_under_age BOOLEAN DEFAULT TRUE,
    
    -- Add-ons
    jersey_addon_available BOOLEAN DEFAULT FALSE,
    jersey_price DECIMAL(10,2) NULL,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (venue_id) REFERENCES venues(id),
    INDEX idx_event_date (event_date),
    INDEX idx_category (category_id),
    INDEX idx_trending (is_trending),
    INDEX idx_presale (is_presale),
    INDEX idx_location (location)
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

-- Users table (unified auth and user profile)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(200),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    is_under_age BOOLEAN DEFAULT FALSE,
    is_authenticated BOOLEAN DEFAULT FALSE,
    language_preference ENUM('en', 'es') DEFAULT 'en',
    notification_preferences BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_language (language_preference)
);

-- User favorite categories
CREATE TABLE user_favorite_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_category (user_id, category_id)
);

-- User favorite events
CREATE TABLE user_favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_event_favorite (user_id, event_id)
);

-- Transportation options
CREATE TABLE transportation_options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    transportation_type_id INT NOT NULL,
    additional_cost DECIMAL(10,2) DEFAULT 0,
    capacity INT,
    is_available BOOLEAN DEFAULT TRUE,
    special_instructions TEXT,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (transportation_type_id) REFERENCES transportation_types(id),
    INDEX idx_event_transport (event_id),
    INDEX idx_transport_type (transportation_type_id)
);

-- Cart/checkout sessions (temporary storage)
CREATE TABLE checkout_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_data JSON NOT NULL,
    current_step ENUM('selection', 'details', 'payment', 'confirmation') DEFAULT 'selection',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_sessions (user_id),
    INDEX idx_expiry (expires_at)
);

-- Promo codes
CREATE TABLE promo_codes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase_amount DECIMAL(10,2) DEFAULT 0,
    max_uses INT,
    current_uses INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_promo_code (code),
    INDEX idx_promo_active (is_active)
);

-- Bookings/Purchases table (renamed and enhanced)
CREATE TABLE purchases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    zone_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    taxes DECIMAL(10,2) DEFAULT 0,
    fees DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Status tracking
    purchase_status ENUM('reserved', 'confirmed', 'cancelled', 'refunded') DEFAULT 'reserved',
    payment_status ENUM('pending', 'paid', 'partial', 'refunded') DEFAULT 'pending',
    
    -- Payment information
    payment_method ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer') NOT NULL,
    payment_installments INT DEFAULT 1,
    is_deposit_payment BOOLEAN DEFAULT FALSE,
    
    -- Transportation
    transportation_option_id INT NULL, -- References transportation_options table
    transport_origin VARCHAR(255),
    
    -- Customer details
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    
    -- Additional options
    includes_jersey BOOLEAN DEFAULT FALSE,
    special_requests TEXT,
    promo_code VARCHAR(50),
    
    -- Reference and tracking
    purchase_reference VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (zone_id) REFERENCES event_zones(id),
    FOREIGN KEY (transportation_option_id) REFERENCES transportation_options(id),
    INDEX idx_user_purchases (user_id),
    INDEX idx_event_purchases (event_id),
    INDEX idx_purchase_reference (purchase_reference),
    INDEX idx_purchase_status (purchase_status),
    INDEX idx_purchase_date (created_at)
);

-- Jersey selections for purchases
CREATE TABLE jersey_selections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    purchase_id INT NOT NULL,
    ticket_index INT NOT NULL, -- which ticket (1, 2, 3, etc.)
    jersey_size VARCHAR(10) NOT NULL,
    player_name VARCHAR(100) NOT NULL,
    player_number VARCHAR(10) NOT NULL,
    additional_cost DECIMAL(10,2) DEFAULT 0,
    
    FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
    INDEX idx_purchase_jerseys (purchase_id)
);

-- Tickets table (individual tickets within a purchase)
CREATE TABLE tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    purchase_id INT NOT NULL,
    zone_id INT NOT NULL,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    attendee_name VARCHAR(200),
    ticket_status ENUM('active', 'used', 'cancelled', 'transferred') DEFAULT 'active',
    qr_code VARCHAR(255),
    seat_section VARCHAR(10),
    seat_row VARCHAR(10),
    seat_number VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
    FOREIGN KEY (zone_id) REFERENCES event_zones(id),
    INDEX idx_ticket_number (ticket_number),
    INDEX idx_purchase_tickets (purchase_id)
);

-- Payment installments table
CREATE TABLE payment_installments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    purchase_id INT NOT NULL,
    installment_number INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date TIMESTAMP NULL,
    payment_status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
    payment_method ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer'),
    transaction_reference VARCHAR(255),
    
    FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
    INDEX idx_purchase_installments (purchase_id),
    INDEX idx_due_date (due_date),
    INDEX idx_payment_status (payment_status)
);

-- Reviews table
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    purchase_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT TRUE,
    helpful_votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    UNIQUE KEY unique_user_event_review (user_id, event_id),
    INDEX idx_event_reviews (event_id),
    INDEX idx_user_reviews (user_id)
);

-- Event analytics table (for tracking views, searches, etc.)
CREATE TABLE event_analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT,
    action_type ENUM('view', 'search', 'favorite', 'cart_add', 'purchase_start', 'purchase_complete') NOT NULL,
    session_id VARCHAR(255),
    user_agent VARCHAR(500),
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_event_analytics (event_id),
    INDEX idx_user_analytics (user_id),
    INDEX idx_action_type (action_type),
    INDEX idx_created_date (created_at)
);

-- Insert default transportation types
INSERT INTO transportation_types (type_code, type_name, description, display_order) VALUES
('none', 'No Transportation', 'Event does not include transportation - attendee arranges own transport', 1),
('van', 'Van/Bus', 'Ground transportation via van or bus', 2),
('flight', 'Flight', 'Air transportation via commercial or charter flight', 3),
('train', 'Train', 'Railway transportation', 4),
('boat', 'Boat/Ferry', 'Water transportation via boat or ferry', 5),
('private_car', 'Private Car', 'Private vehicle transportation', 6),
('shuttle', 'Shuttle Service', 'Hotel or venue shuttle service', 7),
('taxi_uber', 'Taxi/Rideshare', 'Taxi or rideshare service (Uber/Lyft)', 8);

-- Insert default categories
INSERT INTO categories (name, icon, color, description) VALUES
('Sports', '⚽', 'bg-gradient-to-r from-green-500 to-green-600', 'Football, basketball, tennis, and other sporting events'),
('Music', '🎵', 'bg-gradient-to-r from-purple-500 to-purple-600', 'Concerts, festivals, and live music performances'),
('Theater', '🎭', 'bg-gradient-to-r from-red-500 to-red-600', 'Plays, musicals, and theatrical performances'),
('Business', '💼', 'bg-gradient-to-r from-blue-500 to-blue-600', 'Conferences, seminars, and business events'),
('Cultural', '🏛️', 'bg-gradient-to-r from-yellow-500 to-yellow-600', 'Museums, exhibitions, and cultural experiences'),
('Family', '👨‍👩‍👧‍👦', 'bg-gradient-to-r from-pink-500 to-pink-600', 'Family-friendly events and activities'),
('Food', '🍽️', 'bg-gradient-to-r from-orange-500 to-orange-600', 'Food festivals, wine tastings, and culinary events'),
('Technology', '💻', 'bg-gradient-to-r from-cyan-500 to-cyan-600', 'Tech conferences, product launches, and innovation events');