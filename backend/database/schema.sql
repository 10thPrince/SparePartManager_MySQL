-- Database schema for the Spare Inventory Management backend.
-- Run with: mysql -u root -p < backend/database/schema.sql

CREATE DATABASE IF NOT EXISTS SIMS
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE SIMS;

CREATE TABLE IF NOT EXISTS users (
    UserId INT UNSIGNED NOT NULL AUTO_INCREMENT,
    UserName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    PRIMARY KEY (UserId),
    UNIQUE KEY uq_users_email (Email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS spareparts (
    SparePartId INT UNSIGNED NOT NULL AUTO_INCREMENT,
    SparePartName VARCHAR(150) NOT NULL,
    Category VARCHAR(100) NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    Quantity INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (SparePartId),
    KEY idx_spareparts_name (SparePartName),
    KEY idx_spareparts_category (Category)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS stockin (
    StockInId INT UNSIGNED NOT NULL AUTO_INCREMENT,
    SparePartId INT UNSIGNED NOT NULL,
    Quantity INT UNSIGNED NOT NULL,
    StockInDate DATE NOT NULL,
    PRIMARY KEY (StockInId),
    KEY idx_stockin_spare_part_id (SparePartId),
    KEY idx_stockin_date (StockInDate),
    CONSTRAINT fk_stockin_spareparts
        FOREIGN KEY (SparePartId)
        REFERENCES spareparts (SparePartId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS stockout (
    StockOutId INT UNSIGNED NOT NULL AUTO_INCREMENT,
    SparePartId INT UNSIGNED NOT NULL,
    Quantity INT UNSIGNED NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    TotalPrice DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    StockOutDate DATE NOT NULL,
    PRIMARY KEY (StockOutId),
    KEY idx_stockout_spare_part_id (SparePartId),
    KEY idx_stockout_date (StockOutDate),
    CONSTRAINT fk_stockout_spareparts
        FOREIGN KEY (SparePartId)
        REFERENCES spareparts (SparePartId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Useful ALTER queries for future changes.
-- Keep these commented until you need one of them.

-- Change the database selected for manual queries:
-- USE SIMS;

-- Change a column type:
-- ALTER TABLE spareparts MODIFY UnitPrice DECIMAL(12, 2) NOT NULL DEFAULT 0.00;

-- Rename a column:
-- ALTER TABLE spareparts RENAME COLUMN SparePartName TO PartName;

-- Add a new column:
-- ALTER TABLE spareparts ADD Description TEXT NULL AFTER Category;

-- Change an existing column name and type:
-- ALTER TABLE users CHANGE UserName FullName VARCHAR(150) NOT NULL;

-- Drop a column:
-- ALTER TABLE spareparts DROP COLUMN Description;

-- Add a unique constraint:
-- ALTER TABLE spareparts ADD CONSTRAINT uq_spareparts_name UNIQUE (SparePartName);

-- Drop a unique constraint or index:
-- ALTER TABLE spareparts DROP INDEX uq_spareparts_name;

-- Add stock-in price columns if the backend is later changed to store them:
-- ALTER TABLE stockin ADD UnitPrice DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER Quantity;
-- ALTER TABLE stockin ADD TotalPrice DECIMAL(12, 2) NOT NULL DEFAULT 0.00 AFTER UnitPrice;

-- Remove stock-in price columns if they are no longer used:
-- ALTER TABLE stockin DROP COLUMN TotalPrice;
-- ALTER TABLE stockin DROP COLUMN UnitPrice;
