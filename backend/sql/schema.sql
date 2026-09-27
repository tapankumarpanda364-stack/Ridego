-- RideGo schema for SQL Server
-- Run against the database named in DB_NAME (see .env.example)

IF OBJECT_ID('dbo.Ratings', 'U') IS NOT NULL DROP TABLE dbo.Ratings;
IF OBJECT_ID('dbo.Payments', 'U') IS NOT NULL DROP TABLE dbo.Payments;
IF OBJECT_ID('dbo.Rides', 'U') IS NOT NULL DROP TABLE dbo.Rides;
IF OBJECT_ID('dbo.Vehicles', 'U') IS NOT NULL DROP TABLE dbo.Vehicles;
IF OBJECT_ID('dbo.Drivers', 'U') IS NOT NULL DROP TABLE dbo.Drivers;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;

CREATE TABLE dbo.Users (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    name          NVARCHAR(120)  NOT NULL,
    email         NVARCHAR(180)  NOT NULL UNIQUE,
    phone         NVARCHAR(20)   NOT NULL,
    password_hash NVARCHAR(200)  NOT NULL,
    role          VARCHAR(10)    NOT NULL CHECK (role IN ('rider','driver','admin')),
    status        VARCHAR(10)    NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended')),
    created_at    DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.Drivers (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    user_id          INT NOT NULL UNIQUE FOREIGN KEY REFERENCES dbo.Users(id),
    rating           DECIMAL(2,1) NOT NULL DEFAULT 5.0,
    trips_completed  INT NOT NULL DEFAULT 0,
    status           VARCHAR(10) NOT NULL DEFAULT 'offline' CHECK (status IN ('online','offline')),
    current_lat      DECIMAL(9,6) NULL,
    current_lng      DECIMAL(9,6) NULL
);

CREATE TABLE dbo.Vehicles (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    driver_id     INT NOT NULL FOREIGN KEY REFERENCES dbo.Drivers(id),
    plate_number  NVARCHAR(20) NOT NULL UNIQUE,
    model         NVARCHAR(80) NOT NULL,
    type          VARCHAR(10)  NOT NULL CHECK (type IN ('Bike','Auto','Sedan','SUV')),
    verified      BIT NOT NULL DEFAULT 0
);

CREATE TABLE dbo.Rides (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    rider_id      INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(id),
    driver_id     INT NULL FOREIGN KEY REFERENCES dbo.Drivers(id),
    pickup        NVARCHAR(200) NOT NULL,
    drop_location NVARCHAR(200) NOT NULL,
    vehicle_type  VARCHAR(10)   NOT NULL CHECK (vehicle_type IN ('Bike','Auto','Sedan','SUV')),
    distance_km   DECIMAL(6,2)  NOT NULL,
    duration_min  INT           NOT NULL,
    surge         DECIMAL(3,1)  NOT NULL DEFAULT 1.0,
    fare          DECIMAL(8,2)  NOT NULL,
    status        VARCHAR(12)   NOT NULL DEFAULT 'requested'
                  CHECK (status IN ('requested','ongoing','completed','cancelled')),
    created_at    DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
    completed_at  DATETIME2     NULL
);

CREATE TABLE dbo.Payments (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    ride_id     INT NOT NULL FOREIGN KEY REFERENCES dbo.Rides(id),
    amount      DECIMAL(8,2) NOT NULL,
    method      VARCHAR(10)  NOT NULL DEFAULT 'cash' CHECK (method IN ('cash','card','upi','wallet')),
    status      VARCHAR(10)  NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded')),
    created_at  DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.Ratings (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    ride_id     INT NOT NULL UNIQUE FOREIGN KEY REFERENCES dbo.Rides(id),
    rider_id    INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(id),
    driver_id   INT NOT NULL FOREIGN KEY REFERENCES dbo.Drivers(id),
    rating      DECIMAL(2,1) NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     NVARCHAR(400) NULL,
    created_at  DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE INDEX IX_Rides_rider ON dbo.Rides(rider_id);
CREATE INDEX IX_Rides_driver ON dbo.Rides(driver_id);
CREATE INDEX IX_Rides_status ON dbo.Rides(status);
