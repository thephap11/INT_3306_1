-- ============================================================
-- DATABASE SCHEMA - Football Field Management System
-- Generated: December 28, 2025
-- ============================================================

-- Drop tables if exists (in reverse order of dependencies)
DROP TABLE IF EXISTS `revenue_monthly`;
DROP TABLE IF EXISTS `revenue_weekly`;
DROP TABLE IF EXISTS `revenue_daily`;
DROP TABLE IF EXISTS `replies`;
DROP TABLE IF EXISTS `feedbacks`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `password_resets`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `field_schedules`;
DROP TABLE IF EXISTS `field_images`;
DROP TABLE IF EXISTS `fields`;
DROP TABLE IF EXISTS `person`;

-- ============================================================
-- Table: person
-- Description: Stores user information (customers, managers, admins)
-- ============================================================
CREATE TABLE `person` (
  `person_id` INT NOT NULL AUTO_INCREMENT,
  `person_name` VARCHAR(50) NOT NULL,
  `birthday` DATE,
  `sex` VARCHAR(10),
  `address` VARCHAR(45),
  `email` VARCHAR(45) UNIQUE,
  `phone` VARCHAR(10),
  `username` VARCHAR(45) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(45) DEFAULT 'user',
  `status` VARCHAR(45) DEFAULT 'active',
  `fieldId` INT,
  PRIMARY KEY (`person_id`),
  INDEX `idx_username` (`username`),
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: fields
-- Description: Stores football field information
-- ============================================================
CREATE TABLE `fields` (
  `field_id` INT NOT NULL AUTO_INCREMENT,
  `manager_id` INT,
  `field_name` VARCHAR(50) NOT NULL,
  `location` VARCHAR(100),
  `status` VARCHAR(45) DEFAULT 'active',
  `rental_price` DECIMAL(10,2),
  PRIMARY KEY (`field_id`),
  INDEX `idx_manager_id` (`manager_id`),
  INDEX `idx_status` (`status`),
  FOREIGN KEY (`manager_id`) REFERENCES `person`(`person_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: field_images
-- Description: Stores images for football fields
-- ============================================================
CREATE TABLE `field_images` (
  `image_id` INT NOT NULL AUTO_INCREMENT,
  `field_id` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `is_primary` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`),
  INDEX `idx_field_id` (`field_id`),
  FOREIGN KEY (`field_id`) REFERENCES `fields`(`field_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: field_schedules
-- Description: Stores field availability schedules
-- ============================================================
CREATE TABLE `field_schedules` (
  `schedule_id` INT NOT NULL AUTO_INCREMENT,
  `field_id` INT NOT NULL,
  `manager_id` INT,
  `date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `status` VARCHAR(45) DEFAULT 'available',
  `price` DECIMAL(10,2),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`schedule_id`),
  INDEX `idx_field_date` (`field_id`, `date`),
  INDEX `idx_status` (`status`),
  FOREIGN KEY (`field_id`) REFERENCES `fields`(`field_id`) ON DELETE CASCADE,
  FOREIGN KEY (`manager_id`) REFERENCES `person`(`person_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: bookings
-- Description: Stores field booking information
-- ============================================================
CREATE TABLE `bookings` (
  `booking_id` INT NOT NULL AUTO_INCREMENT,
  `customer_id` INT NOT NULL,
  `field_id` INT NOT NULL,
  `manager_id` INT,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `status` VARCHAR(45) DEFAULT 'pending',
  `price` DECIMAL(10,2),
  `note` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`booking_id`),
  INDEX `idx_customer_id` (`customer_id`),
  INDEX `idx_field_id` (`field_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_start_time` (`start_time`),
  FOREIGN KEY (`customer_id`) REFERENCES `person`(`person_id`) ON DELETE CASCADE,
  FOREIGN KEY (`field_id`) REFERENCES `fields`(`field_id`) ON DELETE CASCADE,
  FOREIGN KEY (`manager_id`) REFERENCES `person`(`person_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: payments
-- Description: Stores payment information for bookings
-- ============================================================
CREATE TABLE `payments` (
  `payment_id` INT NOT NULL AUTO_INCREMENT,
  `booking_id` INT NOT NULL,
  `customer_id` INT NOT NULL,
  `field_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `payment_method` VARCHAR(45),
  `payment_status` VARCHAR(45) DEFAULT 'pending',
  `transaction_id` VARCHAR(100),
  `paid_at` TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  INDEX `idx_booking_id` (`booking_id`),
  INDEX `idx_payment_status` (`payment_status`),
  FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`booking_id`) ON DELETE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `person`(`person_id`) ON DELETE CASCADE,
  FOREIGN KEY (`field_id`) REFERENCES `fields`(`field_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: reviews
-- Description: Stores customer reviews for fields
-- ============================================================
CREATE TABLE `reviews` (
  `review_id` INT NOT NULL AUTO_INCREMENT,
  `customer_id` INT NOT NULL,
  `field_id` INT NOT NULL,
  `booking_id` INT,
  `rating` INT NOT NULL,
  `comment` TEXT,
  `images` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  INDEX `idx_customer_id` (`customer_id`),
  INDEX `idx_field_id` (`field_id`),
  INDEX `idx_rating` (`rating`),
  FOREIGN KEY (`customer_id`) REFERENCES `person`(`person_id`) ON DELETE CASCADE,
  FOREIGN KEY (`field_id`) REFERENCES `fields`(`field_id`) ON DELETE CASCADE,
  FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`booking_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: feedbacks
-- Description: Stores general feedback from users
-- ============================================================
CREATE TABLE `feedbacks` (
  `feedback_id` INT NOT NULL AUTO_INCREMENT,
  `person_id` INT NOT NULL,
  `subject` VARCHAR(100),
  `message` TEXT NOT NULL,
  `status` VARCHAR(45) DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`feedback_id`),
  INDEX `idx_person_id` (`person_id`),
  INDEX `idx_status` (`status`),
  FOREIGN KEY (`person_id`) REFERENCES `person`(`person_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: replies
-- Description: Stores admin/manager replies to feedbacks
-- ============================================================
CREATE TABLE `replies` (
  `reply_id` INT NOT NULL AUTO_INCREMENT,
  `feedback_id` INT NOT NULL,
  `admin_id` INT NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reply_id`),
  INDEX `idx_feedback_id` (`feedback_id`),
  FOREIGN KEY (`feedback_id`) REFERENCES `feedbacks`(`feedback_id`) ON DELETE CASCADE,
  FOREIGN KEY (`admin_id`) REFERENCES `person`(`person_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: revenue_daily
-- Description: Stores daily revenue statistics
-- ============================================================
CREATE TABLE `revenue_daily` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `field_id` INT,
  `total_bookings` INT DEFAULT 0,
  `total_revenue` DECIMAL(10,2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_date_field` (`date`, `field_id`),
  INDEX `idx_date` (`date`),
  FOREIGN KEY (`field_id`) REFERENCES `fields`(`field_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: revenue_weekly
-- Description: Stores weekly revenue statistics
-- ============================================================
CREATE TABLE `revenue_weekly` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `year` INT NOT NULL,
  `week` INT NOT NULL,
  `field_id` INT,
  `total_bookings` INT DEFAULT 0,
  `total_revenue` DECIMAL(10,2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_year_week_field` (`year`, `week`, `field_id`),
  INDEX `idx_year_week` (`year`, `week`),
  FOREIGN KEY (`field_id`) REFERENCES `fields`(`field_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: revenue_monthly
-- Description: Stores monthly revenue statistics
-- ============================================================
CREATE TABLE `revenue_monthly` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `year` INT NOT NULL,
  `month` INT NOT NULL,
  `field_id` INT,
  `total_bookings` INT DEFAULT 0,
  `total_revenue` DECIMAL(10,2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_year_month_field` (`year`, `month`, `field_id`),
  INDEX `idx_year_month` (`year`, `month`),
  FOREIGN KEY (`field_id`) REFERENCES `fields`(`field_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: password_resets
-- Description: Stores password reset tokens
-- ============================================================
CREATE TABLE `password_resets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Add foreign key for person.fieldId
-- ============================================================
ALTER TABLE `person`
  ADD CONSTRAINT `fk_person_field`
  FOREIGN KEY (`fieldId`) REFERENCES `fields`(`field_id`) ON DELETE SET NULL;

-- ============================================================
-- END OF SCHEMA
-- ============================================================
