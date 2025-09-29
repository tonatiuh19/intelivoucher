# InteliVoucher Database Schema

A simple MySQL database schema for the InteliVoucher trip/event ticketing system.

## Database Structure

### Core Tables

1. **categories** - Event categories (Concert, Sports, Theater, etc.)
2. **venues** - Event locations and venue information
3. **events** - Main events/trips table with all event details
4. **event_payment_options** - Payment options for each event
5. **event_gifts** - Gifts included with events
6. **users** - User accounts and profiles
7. **bookings** - Customer orders/reservations
8. **tickets** - Individual tickets within bookings
9. **payment_installments** - Payment plan details
10. **reviews** - User reviews and ratings

### Key Features

- **Normalized Design**: Properly normalized tables to reduce redundancy
- **Referential Integrity**: Foreign key constraints ensure data consistency
- **Flexible Payment Options**: Support for installments, deposits, and various payment methods
- **Under-age Support**: Automatic calculation of user age status
- **Rating System**: Automatic event rating calculation from reviews
- **Jersey Add-ons**: Support for merchandise add-ons
- **Transportation Options**: Track events that include transportation

## Setup Instructions

### 1. Create the Database

```sql
-- Run the main schema file
mysql -u root -p < database/schema.sql
```

### 2. Insert Sample Data

```sql
-- Load sample data
mysql -u root -p < database/sample_data.sql
```

### 3. Verify Installation

```sql
USE intelivoucher;

-- Check tables were created
SHOW TABLES;

-- View sample events
SELECT * FROM event_summary LIMIT 5;

-- View sample bookings
SELECT * FROM user_booking_history LIMIT 5;
```

## Common Queries

### Get All Trending Events

```sql
SELECT e.*, c.name as category, v.name as venue, v.city
FROM events e
JOIN categories c ON e.category_id = c.id
JOIN venues v ON e.venue_id = v.id
WHERE e.is_trending = TRUE
AND e.is_sold_out = FALSE
ORDER BY e.event_date;
```

### Get User's Booking History

```sql
SELECT * FROM user_booking_history
WHERE user_id = 1
ORDER BY booking_date DESC;
```

### Get Events with Available Installment Plans

```sql
SELECT e.title, e.price_from, e.event_date
FROM events e
JOIN event_payment_options epo ON e.id = epo.event_id
WHERE epo.installments_available = TRUE
AND e.is_sold_out = FALSE;
```

### Get Events by Category

```sql
SELECT e.*, v.city, v.name as venue_name
FROM events e
JOIN categories c ON e.category_id = c.id
JOIN venues v ON e.venue_id = v.id
WHERE c.name = 'Concert'
ORDER BY e.event_date;
```

### Get Revenue by Event

```sql
SELECT
    e.title,
    COUNT(b.id) as total_bookings,
    SUM(b.total_amount) as total_revenue,
    AVG(b.total_amount) as avg_booking_value
FROM events e
LEFT JOIN bookings b ON e.id = b.event_id
WHERE b.booking_status = 'confirmed'
GROUP BY e.id, e.title
ORDER BY total_revenue DESC;
```

## Database Views

### event_summary

Provides a comprehensive overview of each event including:

- Basic event details
- Category and venue information
- Booking statistics
- Tickets sold count

### user_booking_history

Shows complete booking history for users including:

- User details
- Event information
- Booking status and payment information
- Chronological ordering

## Integration Notes

### For Frontend (React)

The database structure supports all the features shown in your `Index.tsx`:

- Event filtering by category, trending status, etc.
- Payment options (installments, deposits)
- Gift inclusions and jersey add-ons
- Under-age restrictions
- Transportation inclusion

### For API Development

Consider creating these endpoints:

- `GET /api/events` - List events with filters
- `GET /api/events/:id` - Get event details
- `POST /api/bookings` - Create new booking
- `GET /api/users/:id/bookings` - Get user bookings
- `POST /api/reviews` - Add event review

## Performance Considerations

The schema includes indexes on commonly queried fields:

- Event date and category for filtering
- Booking reference for quick lookup
- User email for authentication
- Event trending status for homepage

## Future Enhancements

Potential additions to consider:

- Seat mapping tables for venues with assigned seating
- Promotional codes and discount system
- Waitlist functionality for sold-out events
- Event organizer/promoter management
- Notification preferences and history
- Mobile app push notification tokens
