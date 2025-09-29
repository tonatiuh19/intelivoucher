-- Sample data for InteliVoucher Trip System
-- Insert sample categories, venues, events, and related data

USE intelivoucher;

-- Insert Categories
INSERT INTO categories (name, icon, color, description) VALUES
('Concert', '🎵', 'bg-gradient-to-r from-brand-blue to-brand-cyan', 'Live music performances and concerts'),
('NBA Experience', '🏀', 'bg-gradient-to-r from-brand-cyan to-brand-blue', 'Professional basketball games and experiences'),
('Marathon', '🏃', 'bg-gradient-to-r from-brand-green to-brand-orange', 'Running events and marathons'),
('Soccer Experience', '⚽', 'bg-gradient-to-r from-brand-blue to-brand-cyan', 'Professional soccer matches and experiences'),
('NFL Experience', '🏈', 'bg-gradient-to-r from-brand-green to-brand-orange', 'American football games and experiences'),
('NHL Experience', '🏒', 'bg-gradient-to-r from-brand-blue to-brand-cyan', 'Professional hockey games and experiences'),
('Theater', '🎭', 'bg-gradient-to-r from-brand-green to-brand-orange', 'Broadway shows and theatrical performances'),
('Festival', '🎪', 'bg-gradient-to-r from-brand-orange to-brand-green', 'Music festivals and cultural events'),
('Comedy', '😄', 'bg-gradient-to-r from-brand-cyan to-brand-blue', 'Stand-up comedy shows'),
('Classical', '🎼', 'bg-gradient-to-r from-brand-blue to-brand-cyan', 'Classical music and orchestra performances');

-- Insert Venues
INSERT INTO venues (name, address, city, state, country, capacity) VALUES
('Madison Square Garden', '4 Pennsylvania Plaza', 'New York', 'NY', 'USA', 20789),
('Crypto.com Arena', '1111 S Figueroa St', 'Los Angeles', 'CA', 'USA', 20000),
('New York City', 'Various Locations', 'New York', 'NY', 'USA', NULL),
('Camp Nou', 'C. d''Arístides Maillol, 12', 'Barcelona', NULL, 'Spain', 99354),
('Santiago Bernabéu Stadium', 'Av. de Concha Espina, 1', 'Madrid', NULL, 'Spain', 81044),
('Lambeau Field', '1265 Lombardi Ave', 'Green Bay', 'WI', 'USA', 81441),
('TBD Venue', 'To Be Determined', 'TBD', 'TBD', 'USA', NULL),
('Richard Rodgers Theatre', '226 W 46th St', 'New York', 'NY', 'USA', 1319),
('Coachella Valley', '81800 51st Ave', 'Indio', 'CA', 'USA', 125000),
('Comedy Cellar', '117 MacDougal St', 'New York', 'NY', 'USA', 140),
('Carnegie Hall', '881 7th Ave', 'New York', 'NY', 'USA', 2804);

-- Insert Events
INSERT INTO events (title, category_id, venue_id, description, event_date, price_from, image_url, rating, is_sold_out, is_trending, includes_transportation, is_presale, requires_ticket_acquisition, refundable_if_no_ticket, accepts_under_age, jersey_addon_available, jersey_price) VALUES
('Coldplay World Tour 2024', 1, 1, 'Experience Coldplay''s spectacular world tour with amazing visuals and hits', '2024-12-15', 89.00, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop', 4.9, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, NULL),
('Lakers vs Warriors Courtside Experience', 2, 2, 'Premium courtside experience for the Lakers vs Warriors game', '2024-12-20', 499.00, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop', 4.8, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, NULL),
('NYC Marathon 2024 Travel Package', 3, 3, 'Complete travel package for NYC Marathon including accommodation and support', '2024-11-03', 299.00, 'https://images.unsplash.com/photo-1545060894-7e716cc86a1b?w=400&h=300&fit=crop', 4.7, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, NULL),
('El Clásico Match + Stadium Tour', 4, 4, 'Experience El Clásico between Barcelona and Real Madrid with exclusive stadium tour', '2025-03-15', 699.00, 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=400&h=300&fit=crop', 4.9, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 120.00),
('Green Bay Packers Game + Lambeau Tour', 5, 6, 'NFL game experience with historic Lambeau Field tour', '2025-01-12', 349.00, 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=300&fit=crop', 4.6, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, NULL),
('NHL Winter Classic VIP Experience', 6, 7, 'VIP experience for NHL Winter Classic outdoor game', '2025-01-01', 599.00, 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop', 4.8, FALSE, FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, FALSE, NULL),
('Hamilton Musical', 7, 8, 'Award-winning Broadway musical Hamilton', '2024-12-18', 199.00, 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400&h=300&fit=crop', 4.9, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, NULL),
('Coachella 2024', 8, 9, 'Premier music and arts festival in the desert', '2024-12-22', 299.00, 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=300&fit=crop', 4.7, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, NULL),
('Comedy Night Live', 9, 10, 'Stand-up comedy show featuring top comedians', '2024-12-28', 45.00, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop', 4.6, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, NULL),
('Beethoven Symphony', 10, 11, 'Classical symphony performance at Carnegie Hall', '2024-12-25', 75.00, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop', 4.9, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, NULL);

-- Insert Payment Options
INSERT INTO event_payment_options (event_id, installments_available, presale_deposit_available, second_payment_installments_available) VALUES
(1, TRUE, FALSE, FALSE),
(2, TRUE, FALSE, FALSE),
(3, TRUE, FALSE, FALSE),
(4, TRUE, TRUE, TRUE),
(5, TRUE, FALSE, FALSE),
(6, TRUE, TRUE, TRUE),
(7, TRUE, FALSE, FALSE),
(8, TRUE, FALSE, FALSE),
(9, TRUE, FALSE, FALSE),
(10, TRUE, FALSE, FALSE);

-- Insert Event Gifts
INSERT INTO event_gifts (event_id, gift_name) VALUES
(1, 'Holographic Lanyard'),
(1, 'Event Poster'),
(2, 'Team Scarf'),
(2, 'Souvenir Program'),
(3, 'Finisher Medal'),
(3, 'Race Shirt'),
(4, 'Stadium Tour Photo'),
(4, 'Commemorative Scarf'),
(5, 'Sideline Cap'),
(6, 'Beanie'),
(6, 'Commemorative Puck'),
(7, 'Playbill'),
(8, 'Wristband Kit'),
(10, 'Program Booklet');

-- Insert Event Zones
INSERT INTO event_zones (event_id, zone_name, zone_description, price, capacity, available_seats, is_available, display_order) VALUES
-- Coldplay Concert zones
(1, 'VIP Experience', 'Meet & greet, premium seating, exclusive merchandise', 599.00, 100, 85, TRUE, 1),
(1, 'Lower Bowl', 'Close to stage with great view', 299.00, 500, 423, TRUE, 2),
(1, 'Upper Deck', 'Elevated view of the entire venue', 149.00, 1000, 876, TRUE, 3),
(1, 'General Admission', 'Standing room near stage', 89.00, 800, 0, FALSE, 4),

-- Lakers vs Warriors zones  
(2, 'Courtside', 'Premium courtside seats with player interaction', 2499.00, 20, 12, TRUE, 1),
(2, 'Floor Seats', 'Floor level seating near the action', 999.00, 100, 78, TRUE, 2),
(2, 'Club Level', 'Club access with premium amenities', 699.00, 200, 156, TRUE, 3),
(2, 'Upper Level', 'Great view from upper deck', 499.00, 500, 445, TRUE, 4),

-- NYC Marathon zones
(3, 'Premium Package', '4-star hotel, VIP start corral, post-race celebration', 799.00, 50, 43, TRUE, 1),
(3, 'Standard Package', '3-star hotel, guaranteed entry, race kit', 499.00, 200, 167, TRUE, 2),
(3, 'Basic Package', 'Budget accommodation, race entry, basic support', 299.00, 500, 432, TRUE, 3),
(3, 'Spectator Package', 'Accommodation and viewing areas for supporters', 199.00, 100, 89, TRUE, 4),

-- El Clásico zones
(4, 'VIP Box', 'Private box with catering and premium view', 1899.00, 20, 15, TRUE, 1),
(4, 'Premium Seats', 'Best seats with hospitality package', 1299.00, 100, 82, TRUE, 2),
(4, 'Grandstand', 'Covered seating with great stadium view', 899.00, 300, 256, TRUE, 3),
(4, 'General Admission', 'Standing areas with authentic atmosphere', 699.00, 500, 423, TRUE, 4),

-- Green Bay Packers zones
(5, 'Club Level', 'Indoor/outdoor seating with premium amenities', 799.00, 80, 67, TRUE, 1),
(5, 'Lower Bowl', 'Close to field action with heated concourse', 549.00, 200, 178, TRUE, 2),
(5, 'Upper Deck', 'Great stadium view with Lambeau atmosphere', 399.00, 400, 356, TRUE, 3),
(5, 'Frozen Tundra', 'Authentic outdoor Lambeau experience', 349.00, 300, 234, TRUE, 4),

-- NHL Winter Classic zones
(6, 'Glass Seats', 'Right against the glass with premium amenities', 1299.00, 50, 42, TRUE, 1),
(6, 'Club Seats', 'Indoor/outdoor access with catering', 899.00, 100, 87, TRUE, 2),
(6, 'Lower Bowl', 'Close to ice level in outdoor stadium', 699.00, 200, 178, TRUE, 3),
(6, 'Upper Level', 'Great view of outdoor winter hockey', 599.00, 300, 267, TRUE, 4),

-- Hamilton Musical zones
(7, 'Orchestra Premium', 'Front center orchestra seats with best view', 699.00, 50, 0, FALSE, 1),
(7, 'Orchestra', 'Main floor seating with excellent sightlines', 499.00, 100, 0, FALSE, 2),
(7, 'Mezzanine', 'First balcony with great elevated view', 299.00, 150, 0, FALSE, 3),
(7, 'Balcony', 'Upper level affordable seating', 199.00, 200, 0, FALSE, 4),

-- Coachella zones
(8, 'VIP Area', 'Exclusive viewing areas, premium amenities, air-conditioned restrooms', 899.00, 200, 167, TRUE, 1),
(8, 'Camping Plus', 'Premium camping with shuttle service and upgraded facilities', 599.00, 500, 423, TRUE, 2),
(8, 'General Camping', 'Standard camping with basic amenities', 399.00, 1000, 834, TRUE, 3),
(8, 'General Admission', 'Festival access with all stages and activities', 299.00, 2000, 1756, TRUE, 4),

-- Comedy Night zones
(9, 'Front Row', 'Front row seats - may be part of the show!', 125.00, 10, 8, TRUE, 1),
(9, 'Premium Table', 'Reserved table seating with waitress service', 89.00, 20, 17, TRUE, 2),
(9, 'Standard Seating', 'General seating with good stage view', 65.00, 50, 43, TRUE, 3),
(9, 'Bar Seating', 'Bar stools and standing room', 45.00, 60, 52, TRUE, 4),

-- Beethoven Symphony zones
(10, 'Box Seats', 'Private box seating with exceptional acoustics', 299.00, 30, 26, TRUE, 1),
(10, 'Orchestra Level', 'Main floor seating close to the orchestra', 199.00, 100, 87, TRUE, 2),
(10, 'Dress Circle', 'First tier with excellent sightlines and acoustics', 149.00, 150, 134, TRUE, 3),
(10, 'Balcony', 'Upper level affordable seating with great sound', 75.00, 200, 178, TRUE, 4);

-- Insert Sample Users
INSERT INTO users (email, first_name, last_name, phone, date_of_birth) VALUES
('sarah.chen@example.com', 'Sarah', 'Chen', '+1-555-0101', '1992-08-15'),
('mike.rodriguez@example.com', 'Mike', 'Rodriguez', '+1-555-0102', '1988-03-22'),
('emily.johnson@example.com', 'Emily', 'Johnson', '+1-555-0103', '1995-11-08'),
('john.doe@example.com', 'John', 'Doe', '+1-555-0104', '1990-06-12'),
('jane.smith@example.com', 'Jane', 'Smith', '+1-555-0105', '1987-12-03');

-- Insert Sample Bookings  
INSERT INTO bookings (user_id, event_id, zone_id, quantity, unit_price, total_amount, booking_status, payment_status, payment_method, booking_reference) VALUES
(1, 1, 1, 2, 89.00, 178.00, 'confirmed', 'paid', 'credit_card', 'IV2024001001'),
(2, 2, 1, 1, 499.00, 499.00, 'confirmed', 'paid', 'credit_card', 'IV2024001002'), 
(3, 7, 3, 2, 199.00, 398.00, 'confirmed', 'paid', 'installments', 'IV2024001003'),
(4, 4, 2, 1, 699.00, 819.00, 'pending', 'partial', 'installments', 'IV2024001004'),
(5, 8, 4, 1, 299.00, 299.00, 'confirmed', 'paid', 'paypal', 'IV2024001005');

-- Update booking for El Clasico to include jersey
UPDATE bookings SET includes_jersey = TRUE, jersey_size = 'L' WHERE id = 4;

-- Insert Sample Tickets
INSERT INTO tickets (booking_id, zone_id, ticket_number, attendee_name, seat_section, seat_row, seat_number, qr_code) VALUES
(1, 1, 'IV2024001001-01', 'Sarah Chen', '200', 'A', '15', 'QR001001'),
(1, 1, 'IV2024001001-02', 'Guest +1', '200', 'A', '16', 'QR001002'),
(2, 1, 'IV2024001002-01', 'Mike Rodriguez', 'COURTSIDE', 'A', '1', 'QR001003'),
(3, 3, 'IV2024001003-01', 'Emily Johnson', 'ORCH', 'K', '12', 'QR001004'),
(3, 3, 'IV2024001003-02', 'Guest +1', 'ORCH', 'K', '13', 'QR001005'),
(4, 2, 'IV2024001004-01', 'John Doe', 'VIP', 'A', '5', 'QR001006'),
(5, 4, 'IV2024001005-01', 'Jane Smith', 'GA', NULL, NULL, 'QR001007');

-- Insert Payment Installments
INSERT INTO payment_installments (booking_id, installment_number, amount, due_date, payment_status) VALUES
(3, 1, 199.00, '2024-10-15', 'paid'),
(3, 2, 199.00, '2024-11-15', 'paid'),
(4, 1, 274.00, '2024-10-15', 'paid'),
(4, 2, 272.50, '2024-12-15', 'pending'),
(4, 3, 272.50, '2025-02-15', 'pending');

-- Update paid installments
UPDATE payment_installments SET paid_date = '2024-10-14 14:30:00' WHERE id = 1;
UPDATE payment_installments SET paid_date = '2024-11-14 09:15:00' WHERE id = 2;
UPDATE payment_installments SET paid_date = '2024-10-14 16:45:00' WHERE id = 3;

-- Insert Sample Reviews
INSERT INTO reviews (user_id, event_id, booking_id, rating, review_text) VALUES
(1, 1, 1, 5, 'Amazing concert! Coldplay was incredible and the atmosphere was electric. Definitely worth every penny!'),
(2, 2, 2, 5, 'Courtside seats were a dream come true. Being so close to the action made it an unforgettable experience.'),
(3, 7, 3, 5, 'Hamilton was absolutely phenomenal. The performances, music, and staging were all perfect. A must-see show!');

-- Create views for common queries
CREATE VIEW event_summary AS
SELECT 
    e.id,
    e.title,
    c.name as category,
    v.name as venue,
    v.city,
    v.state,
    e.event_date,
    e.price_from,
    e.rating,
    e.is_sold_out,
    e.is_trending,
    COUNT(DISTINCT b.id) as total_bookings,
    SUM(CASE WHEN b.booking_status = 'confirmed' THEN b.quantity ELSE 0 END) as tickets_sold
FROM events e
LEFT JOIN categories c ON e.category_id = c.id
LEFT JOIN venues v ON e.venue_id = v.id
LEFT JOIN bookings b ON e.id = b.event_id
GROUP BY e.id, e.title, c.name, v.name, v.city, v.state, e.event_date, e.price_from, e.rating, e.is_sold_out, e.is_trending;

CREATE VIEW user_booking_history AS
SELECT 
    u.id as user_id,
    u.first_name,
    u.last_name,
    u.email,
    b.id as booking_id,
    b.booking_reference,
    e.title as event_title,
    e.event_date,
    b.quantity,
    b.total_amount,
    b.booking_status,
    b.payment_status,
    b.created_at as booking_date
FROM users u
LEFT JOIN bookings b ON u.id = b.user_id
LEFT JOIN events e ON b.event_id = e.id
ORDER BY b.created_at DESC;